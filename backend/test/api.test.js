const request = require('supertest')
const { createApp } = require('../app')
const pingService = require('../pingService')

describe('backend API', () => {
  let measurePingMock
  let measureTargetMock
  let app

  beforeEach(() => {
    measurePingMock = vi.fn()
    measureTargetMock = vi.fn()
    app = createApp({
      ...pingService,
      measurePing: measurePingMock,
      measureTarget: measureTargetMock,
    })
  })

  it('rejects unsupported targets before running a ping', async () => {
    const response = await request(app).get('/api/ping?target=unknown')

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: 'Unknown target',
    })
    expect(response.body.supportedTargets).toContain('google')
    expect(measurePingMock).not.toHaveBeenCalled()
  })

  it('returns the default ping response with clamped sample counts', async () => {
    measurePingMock.mockResolvedValue({
      message: 'pong',
      latencyMs: 24,
      samples: 5,
      targets: { google: 25, cloudflare: 23 },
    })

    const response = await request(app).get('/api/ping?samples=10')

    expect(response.status).toBe(200)
    expect(measurePingMock).toHaveBeenCalledWith({ targetId: null, samples: 5 })
    expect(response.body).toMatchObject({
      message: 'pong',
      latencyMs: 24,
      samples: 5,
      targets: { google: 25, cloudflare: 23 },
    })
  })

  it('passes a valid target through to the ping service', async () => {
    measurePingMock.mockResolvedValue({
      message: 'pong',
      target: 'google',
      latencyMs: 22,
      samples: 2,
    })

    const response = await request(app).get('/api/ping?target=google&samples=2')

    expect(response.status).toBe(200)
    expect(measurePingMock).toHaveBeenCalledWith({ targetId: 'google', samples: 2 })
    expect(response.body).toMatchObject({
      message: 'pong',
      target: 'google',
      latencyMs: 22,
      samples: 2,
    })
  })
})
