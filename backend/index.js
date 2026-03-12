const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { exec } = require('child_process')

const app = express()

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

const ALLOWED_TARGETS = ['backend', 'google-dns', 'cloudflare']
const DEFAULT_TARGET = process.env.DEFAULT_PING_TARGET || 'backend'

const pingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/api/ping', pingLimiter, (req, res) => {
  const { target } = req.query

  if (target && !ALLOWED_TARGETS.includes(target)) {
    return res.status(400).json({ error: 'Invalid target' })
  }

  if (!target && !ALLOWED_TARGETS.includes(DEFAULT_TARGET)) {
    return res.status(500).json({ error: 'Invalid DEFAULT_PING_TARGET' })
  }

  res.status(200).json({
    message: 'pong',
    serverTime: Date.now(),
    target: target || DEFAULT_TARGET,
    mode: 'http',
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

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})
