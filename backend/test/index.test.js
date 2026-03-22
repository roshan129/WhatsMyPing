const test = require('node:test')
const assert = require('node:assert/strict')
const { createApp } = require('../index')
const pingService = require('../pingService')

const originalMeasurePing = pingService.measurePing
const originalMeasureTarget = pingService.measureTarget

const listen = (app) =>
  new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address()
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      })
    })
  })

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    server.closeIdleConnections?.()
    server.close((error) => (error ? reject(error) : resolve()))
  })

test.afterEach(() => {
  pingService.measurePing = originalMeasurePing
  pingService.measureTarget = originalMeasureTarget
})

test('GET /health returns ok', async () => {
  const app = createApp({
    enableCors: false,
    serveFrontend: false,
    logger: { log() {}, error() {} },
  })
  const { server, baseUrl } = await listen(app)

  try {
    const response = await fetch(`${baseUrl}/health`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(body, { status: 'ok' })
  } finally {
    await closeServer(server)
  }
})

test('GET /api/targets returns supported targets without internal-only fields', async () => {
  const app = createApp({
    enableCors: false,
    serveFrontend: false,
    logger: { log() {}, error() {} },
  })
  const { server, baseUrl } = await listen(app)

  try {
    const response = await fetch(`${baseUrl}/api/targets`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.ok(body.targets.google)
    assert.deepEqual(body.targets.google, {
      label: 'Google DNS',
      host: '8.8.8.8',
    })
    assert.equal(Object.hasOwn(body.targets.google, 'httpUrl'), false)
  } finally {
    await closeServer(server)
  }
})

test('GET /api/ping rejects unknown targets', async () => {
  const app = createApp({
    enableCors: false,
    serveFrontend: false,
    logger: { log() {}, error() {} },
  })
  const { server, baseUrl } = await listen(app)

  try {
    const response = await fetch(`${baseUrl}/api/ping?target=invalid-target`)
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.error, 'Unknown target')
    assert.ok(Array.isArray(body.supportedTargets))
    assert.ok(body.supportedTargets.includes('google'))
  } finally {
    await closeServer(server)
  }
})

test('GET /api/ping clamps samples before calling measurePing', async () => {
  let capturedArgs = null
  pingService.measurePing = async (args) => {
    capturedArgs = args
    return {
      message: 'pong',
      serverTime: 1710000000000,
      target: 'google',
      label: 'Google DNS',
      host: '8.8.8.8',
      mode: 'external-icmp',
      samples: args.samples,
      latencyMs: 24,
      times: [24],
    }
  }

  const app = createApp({
    enableCors: false,
    serveFrontend: false,
    logger: { log() {}, error() {} },
  })
  const { server, baseUrl } = await listen(app)

  try {
    const response = await fetch(`${baseUrl}/api/ping?target=google&samples=999`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(capturedArgs, { targetId: 'google', samples: 5 })
    assert.equal(body.latencyMs, 24)
  } finally {
    await closeServer(server)
  }
})

test('GET /api/ping-icmp returns 503 when the measurement falls back to HTTP', async () => {
  pingService.measureTarget = async () => ({
    target: 'cloudflare',
    label: 'Cloudflare DNS',
    host: '1.1.1.1',
    latencyMs: 18,
    mode: 'external-http',
  })

  const app = createApp({
    enableCors: false,
    serveFrontend: false,
    logger: { log() {}, error() {} },
  })
  const { server, baseUrl } = await listen(app)

  try {
    const response = await fetch(`${baseUrl}/api/ping-icmp?target=cloudflare`)
    const body = await response.json()

    assert.equal(response.status, 503)
    assert.equal(body.error, 'ICMP ping unavailable for this target right now')
  } finally {
    await closeServer(server)
  }
})
