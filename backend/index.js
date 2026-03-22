const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const path = require('path')
const pingService = require('./pingService')

const PUBLIC_PATHS = ['/', '/ping-test', '/ping-google', '/ping-cloudflare', '/ping-discord', '/ping-youtube', '/ping-aws']

const createApp = ({
  enableCors = process.env.ENABLE_CORS === 'true',
  serveFrontend = process.env.SERVE_FRONTEND === 'true',
  frontendDistPath = process.env.FRONTEND_DIST_PATH || path.join(__dirname, '..', 'frontend', 'dist'),
  logger = console,
} = {}) => {
  const app = express()
  app.set('trust proxy', 1)

  app.use((req, res, next) => {
    logger.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
    next()
  })

  if (enableCors) {
    app.use(cors())
  }
  app.use(express.json())

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_PATHS
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
        Object.entries(pingService.TARGETS).map(([id, target]) => [
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
    const samples = pingService.clampSamples(req.query.samples)
    const targetId = typeof req.query.target === 'string' ? req.query.target.trim() : ''

    if (targetId && !pingService.TARGETS[targetId]) {
      return res
        .status(400)
        .json({ error: 'Unknown target', supportedTargets: Object.keys(pingService.TARGETS) })
    }

    try {
      const result = await pingService.measurePing({ targetId: targetId || null, samples })
      res.status(200).json(result)
    } catch (error) {
      logger.error('Ping error:', error.message)
      res.status(500).json({ error: 'External ping failed' })
    }
  })

  app.get('/api/ping-icmp', pingLimiter, async (req, res) => {
    const targetId = typeof req.query.target === 'string' ? req.query.target.trim() : ''

    if (!targetId || !pingService.TARGETS[targetId]) {
      return res.status(400).json({ error: 'ICMP ping requires a valid target' })
    }

    try {
      const result = await pingService.measureTarget(targetId, 1)

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
      logger.error('ICMP ping error:', error.message)
      res.status(500).json({ error: 'ICMP ping failed' })
    }
  })

  if (serveFrontend) {
    app.use(express.static(frontendDistPath))
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(frontendDistPath, 'index.html'))
    })
  }

  return app
}

const startServer = ({ port = process.env.PORT || 4001, ...options } = {}) => {
  const app = createApp(options)
  return app.listen(port, () => {
    options.logger?.log?.(`Backend server listening on port ${port}`) ?? console.log(`Backend server listening on port ${port}`)
  })
}

if (require.main === module) {
  startServer()
}

module.exports = {
  createApp,
  startServer,
  PUBLIC_PATHS,
}
