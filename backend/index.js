const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { exec } = require('child_process')
const path = require('path')

const app = express()

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

const ENABLE_CORS = process.env.ENABLE_CORS === 'true'
if (ENABLE_CORS) {
  app.use(cors())
}
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

const ALLOWED_TARGETS = ['backend', 'google-dns', 'cloudflare']
const DEFAULT_TARGET = process.env.DEFAULT_PING_TARGET || 'backend'
const EXTERNAL_TARGETS = [
  { id: 'cloudflare', host: '1.1.1.1' },
  { id: 'google', host: '8.8.8.8' },
]

const pingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/api/ping', pingLimiter, (req, res) => {
  const parsedSamples = Number.parseInt(req.query.samples, 10)
  const samples = Number.isFinite(parsedSamples) ? parsedSamples : 4
  const clampedSamples = Math.min(Math.max(samples, 1), 5)

  const pingHost = (host, count) =>
    new Promise((resolve, reject) => {
      exec(`ping -c ${count} ${host}`, { timeout: 8000 }, (error, stdout) => {
        if (error) {
          return reject(error)
        }

        const matches = [...stdout.matchAll(/time[=<]([0-9.]+)\s*ms/g)]
        if (!matches.length) {
          return reject(new Error('No latency data found'))
        }

        const times = matches.map((match) => parseFloat(match[1]))
        const average = times.reduce((sum, value) => sum + value, 0) / times.length

        resolve({
          host,
          times,
          average,
        })
      })
    })

  Promise.all(EXTERNAL_TARGETS.map((target) => pingHost(target.host, clampedSamples)))
    .then((results) => {
      const cloudflare = results[0]
      const google = results[1]
      const finalPing = (cloudflare.average + google.average) / 2

      res.status(200).json({
        message: 'pong',
        serverTime: Date.now(),
        mode: 'external-icmp',
        cloudflare: {
          host: EXTERNAL_TARGETS[0].host,
          times: cloudflare.times,
          average: cloudflare.average,
        },
        google: {
          host: EXTERNAL_TARGETS[1].host,
          times: google.times,
          average: google.average,
        },
        samples: clampedSamples,
        finalPing: Math.round(finalPing),
        latencyMs: Math.round(finalPing),
      })
    })
    .catch((error) => {
      console.error('External ping error:', error.message)
      res.status(500).json({ error: 'External ping failed' })
    })
})

const ICMP_TARGET_MAP = {
  'google-dns': '8.8.8.8',
  cloudflare: '1.1.1.1',
}

app.get('/api/ping-icmp', pingLimiter, (req, res) => {
  const { target } = req.query

  if (!target || !ICMP_TARGET_MAP[target]) {
    return res.status(400).json({ error: 'ICMP ping requires a valid target' })
  }

  const host = ICMP_TARGET_MAP[target]

  exec(`ping -c 1 ${host}`, { timeout: 4000 }, (error, stdout) => {
    if (error) {
      console.error('ICMP ping error:', error.message)
      return res.status(500).json({ error: 'ICMP ping failed' })
    }

    const match = stdout.match(/time=([0-9.]+)\s*ms/)
    if (!match) {
      return res.status(500).json({ error: 'Could not parse ICMP response' })
    }

    const latencyMs = parseFloat(match[1])
    res.status(200).json({
      message: 'pong',
      target,
      host,
      mode: 'icmp',
      latencyMs,
    })
  })
})

const PORT = process.env.PORT || 4001
const FRONTEND_DIST_PATH =
  process.env.FRONTEND_DIST_PATH ||
  path.join(__dirname, '..', 'frontend', 'dist')

if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(FRONTEND_DIST_PATH))
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})
