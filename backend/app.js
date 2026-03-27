const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const path = require('path')
const pingService = require('./pingService')
const dnsService = require('./dnsService')
const jsonService = require('./jsonService')
const { detectIpVersion, getRequestIp } = require('./ipService')

const createApp = (services = {}) => {
  const {
    TARGETS,
    clampSamples,
    measurePing,
    measureTarget,
  } = {
    ...pingService,
    ...services,
  }
  const { lookupDnsRecords, validateDomain } = {
    ...dnsService,
    ...services,
  }
  const { formatJson } = {
    ...jsonService,
    ...services,
  }
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
    const configuredSiteUrl = typeof process.env.PUBLIC_SITE_URL === 'string' ? process.env.PUBLIC_SITE_URL.trim() : ''
    const baseUrl = configuredSiteUrl || `${req.protocol}://${req.get('host')}`
    const paths = [
      '/',
      '/ping-test',
      '/ping-google',
      '/ping-cloudflare',
      '/ping-discord',
      '/ping-youtube',
      '/ping-aws',
      '/what-is-my-ip',
      '/ip-check',
      '/check-my-ip',
      '/my-ip-address',
      '/ip-lookup',
      '/dns-lookup',
      '/dns-check',
      '/check-dns-records',
      '/mx-lookup',
      '/txt-lookup',
      '/json-formatter',
      '/json-pretty-print',
      '/json-validator',
      '/json-viewer',
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

  app.get('/api/ip', (req, res) => {
    const ip = getRequestIp(req)

    res.status(200).json({
      ip,
      version: detectIpVersion(ip),
      userAgent: req.get('user-agent') || null,
    })
  })

  app.get('/api/dns', async (req, res) => {
    const { domain, error } = validateDomain(req.query.domain)

    if (error) {
      return res.status(400).json({ error })
    }

    try {
      const result = await lookupDnsRecords(domain)
      res.status(200).json(result)
    } catch (lookupError) {
      console.error('DNS lookup error:', lookupError.message)
      res.status(502).json({ error: 'DNS lookup failed' })
    }
  })

  app.post('/api/json/format', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.trim()) {
      return res.status(400).json({
        valid: false,
        error: 'Input required',
      })
    }

    try {
      const formatted = formatJson(input)
      return res.status(200).json({
        valid: true,
        formatted,
      })
    } catch (error) {
      return res.status(400).json({
        valid: false,
        error: error.message,
        details: error.details || null,
      })
    }
  })

  app.post('/api/analytics', (req, res) => {
    if (process.env.ENABLE_SIMPLE_ANALYTICS !== 'true') {
      return res.status(204).end()
    }

    const type = typeof req.body?.type === 'string' ? req.body.type.trim() : ''
    if (!type) {
      return res.status(400).json({ error: 'Analytics event type is required' })
    }

    const event = {
      type,
      name: typeof req.body?.name === 'string' ? req.body.name.trim() : null,
      path: typeof req.body?.path === 'string' ? req.body.path.trim() : null,
      toolType: typeof req.body?.toolType === 'string' ? req.body.toolType.trim() : null,
      title: typeof req.body?.title === 'string' ? req.body.title.trim() : null,
      target: typeof req.body?.target === 'string' ? req.body.target.trim() : null,
      latencyMs: typeof req.body?.latencyMs === 'number' ? req.body.latencyMs : null,
      version: typeof req.body?.version === 'number' ? req.body.version : null,
      domain: typeof req.body?.domain === 'string' ? req.body.domain.trim() : null,
      inputLength: typeof req.body?.inputLength === 'number' ? req.body.inputLength : null,
      outputLength: typeof req.body?.outputLength === 'number' ? req.body.outputLength : null,
      warnings: typeof req.body?.warnings === 'number' ? req.body.warnings : null,
      receivedAt: new Date().toISOString(),
      clientIp: getRequestIp(req),
      userAgent: req.get('user-agent') || null,
    }

    console.log('analytics', JSON.stringify(event))
    return res.status(202).json({ accepted: true })
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
