const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const path = require('path')
const pingService = require('./pingService')

const createApp = (services = pingService) => {
  const { TARGETS, clampSamples, measurePing, measureTarget } = services
  const app = express()
  app.set('trust proxy', 1)

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
    next()
  })

  const ENABLE_CORS = process.env.ENABLE_CORS === 'true'
  if (ENABLE_CORS) {
    app.use(cors())
  }
  app.use(express.json())

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const paths = [
      '/',
      '/ping-test',
      '/ping-google',
      '/ping-cloudflare',
      '/ping-discord',
      '/ping-youtube',
      '/ping-aws',
    ]
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (routePath) => `  <url>
    <loc>${baseUrl}${routePath}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`

    res.type('application/xml')
    res.send(xml)
  })

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.get('/api/targets', (req, res) => {
    res.status(200).json({
      targets: Object.fromEntries(
        Object.entries(TARGETS).map(([id, target]) => [
          id,
          {
            label: target.label,
            host: target.host,
          },
        ])
      ),
    })
  })

  const pingLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })

  app.get('/api/ping', pingLimiter, async (req, res) => {
    const samples = clampSamples(req.query.samples)
    const targetId = typeof req.query.target === 'string' ? req.query.target.trim() : ''

    if (targetId && !TARGETS[targetId]) {
      return res.status(400).json({ error: 'Unknown target', supportedTargets: Object.keys(TARGETS) })
    }

    try {
      const result = await measurePing({ targetId: targetId || null, samples })
      res.status(200).json(result)
    } catch (error) {
      console.error('Ping error:', error.message)
      res.status(500).json({ error: 'External ping failed' })
    }
  })

  app.get('/api/ping-icmp', pingLimiter, async (req, res) => {
    const targetId = typeof req.query.target === 'string' ? req.query.target.trim() : ''

    if (!targetId || !TARGETS[targetId]) {
      return res.status(400).json({ error: 'ICMP ping requires a valid target' })
    }

    try {
      const result = await measureTarget(targetId, 1)

      if (result.mode !== 'external-icmp') {
        return res.status(503).json({ error: 'ICMP ping unavailable for this target right now' })
      }

      res.status(200).json({
        message: 'pong',
        target: result.target,
        label: result.label,
        host: result.host,
        mode: 'icmp',
        latencyMs: result.latencyMs,
      })
    } catch (error) {
      console.error('ICMP ping error:', error.message)
      res.status(500).json({ error: 'ICMP ping failed' })
    }
  })

  const FRONTEND_DIST_PATH =
    process.env.FRONTEND_DIST_PATH ||
    path.join(__dirname, '..', 'frontend', 'dist')

  if (process.env.SERVE_FRONTEND === 'true') {
    app.use(express.static(FRONTEND_DIST_PATH))
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'))
    })
  }

  return app
}

module.exports = {
  createApp,
}
