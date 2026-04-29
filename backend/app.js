const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const path = require('path')
const pingService = require('./pingService')
const dnsService = require('./dnsService')
const jsonService = require('./jsonService')
const base64Service = require('./base64Service')
const urlService = require('./urlService')
const uuidService = require('./uuidService')
const jwtService = require('./jwtService')
const timestampService = require('./timestampService')
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
  const { encodeBase64, decodeBase64 } = {
    ...base64Service,
    ...services,
  }
  const { encodeUrl, decodeUrl } = {
    ...urlService,
    ...services,
  }
  const { generateMultipleUUIDs } = {
    ...uuidService,
    ...services,
  }
  const { decodeJwt } = {
    ...jwtService,
    ...services,
  }
  const { formatTimestamp, parseDateInput } = {
    ...timestampService,
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
    const baseUrl = `${req.protocol}://${req.get('host')}`
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
      '/base64-encode',
      '/base64-decode',
      '/text-to-base64',
      '/base64-to-text',
      '/url-encode',
      '/url-decode',
      '/encode-url',
      '/decode-url',
      '/uuid-generator',
      '/generate-uuid',
      '/uuid-v4-generator',
      '/random-uuid-generator',
      '/uuid-generator-online',
      '/jwt-decoder',
      '/decode-jwt',
      '/jwt-parser',
      '/jwt-inspector',
      '/jwt-decoder-online',
      '/timestamp-converter',
      '/unix-timestamp-converter',
      '/epoch-converter',
      '/convert-timestamp',
      '/timestamp-to-date',
      '/blog',
      '/blog/what-is-a-ping-test',
      '/blog/what-is-dns',
      '/blog/what-is-an-ip-address',
      '/blog/what-is-json-and-how-to-format-json',
      '/blog/what-is-base64-encoding-and-decoding',
      '/blog/what-is-jwt-and-how-jwt-works',
      '/blog/what-is-url-encoding-and-decoding',
      '/blog/what-is-uuid',
      '/blog/what-is-a-timestamp',
    ]
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (routePath) => `  <url>
    <loc>${baseUrl}${routePath === '/' ? '/' : `${routePath}/`}</loc>
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

  app.post('/api/base64/encode', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.length) {
      return res.status(400).json({ error: 'Input required' })
    }

    return res.status(200).json({
      output: encodeBase64(input),
    })
  })

  app.post('/api/base64/decode', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.length) {
      return res.status(400).json({ error: 'Input required' })
    }

    try {
      return res.status(200).json({
        output: decodeBase64(input),
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  })

  app.post('/api/url/encode', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.length) {
      return res.status(400).json({ error: 'Input required' })
    }

    return res.status(200).json({
      output: encodeUrl(input),
    })
  })

  app.post('/api/url/decode', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.length) {
      return res.status(400).json({ error: 'Input required' })
    }

    try {
      return res.status(200).json({
        output: decodeUrl(input),
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  })

  app.get('/api/uuid', (req, res) => {
    const requestedCount = Number.parseInt(req.query.count, 10)
    const count = Number.isNaN(requestedCount) || requestedCount < 1 ? 1 : Math.min(requestedCount, 20)

    try {
      const uuids = generateMultipleUUIDs(count)
      return res.status(200).json({ uuids })
    } catch (error) {
      console.error('UUID generation error:', error.message)
      return res.status(500).json({ error: 'Failed to generate UUID' })
    }
  })

  app.post('/api/jwt/decode', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.trim()) {
      return res.status(400).json({ error: 'Input required' })
    }

    try {
      return res.status(200).json(decodeJwt(input))
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  })

  app.post('/api/timestamp/format', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.trim()) {
      return res.status(400).json({ error: 'Input required' })
    }

    try {
      return res.status(200).json(formatTimestamp(input))
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  })

  app.post('/api/timestamp/parse', (req, res) => {
    const input = typeof req.body?.input === 'string' ? req.body.input : ''

    if (!input.trim()) {
      return res.status(400).json({ error: 'Input required' })
    }

    try {
      return res.status(200).json(parseDateInput(input))
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
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
    app.use((req, res, next) => {
      const isPageRequest = req.method === 'GET' || req.method === 'HEAD'
      if (!isPageRequest) {
        return next()
      }

      const skipRedirect =
        req.path === '/' ||
        req.path.endsWith('/') ||
        req.path === '/health' ||
        req.path === '/sitemap.xml' ||
        req.path === '/robots.txt' ||
        req.path.startsWith('/api/') ||
        path.extname(req.path)

      if (skipRedirect) {
        return next()
      }

      const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
      return res.redirect(301, `${req.path}/${query}`)
    })

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
