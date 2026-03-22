const request = require('supertest')
const { createApp } = require('../app')
const dnsService = require('../dnsService')
const pingService = require('../pingService')

describe('backend API', () => {
  let measurePingMock
  let measureTargetMock
  let lookupDnsRecordsMock
  let app

  beforeEach(() => {
    measurePingMock = vi.fn()
    measureTargetMock = vi.fn()
    lookupDnsRecordsMock = vi.fn()
    app = createApp({
      ...pingService,
      ...dnsService,
      measurePing: measurePingMock,
      measureTarget: measureTargetMock,
      lookupDnsRecords: lookupDnsRecordsMock,
    })
  })

  it('returns a healthy status payload', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })

  it('returns supported ping targets without exposing internal http URLs', async () => {
    const response = await request(app).get('/api/targets')

    expect(response.status).toBe(200)
    expect(response.body.targets.google).toEqual({
      label: 'Google DNS',
      host: '8.8.8.8',
    })
    expect(response.body.targets.google.httpUrl).toBeUndefined()
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

  it('returns a 503 from the ICMP endpoint when the target falls back to HTTP timing', async () => {
    measureTargetMock.mockResolvedValue({
      target: 'cloudflare',
      label: 'Cloudflare DNS',
      host: '1.1.1.1',
      latencyMs: 18,
      mode: 'external-http',
    })

    const response = await request(app).get('/api/ping-icmp?target=cloudflare')

    expect(response.status).toBe(503)
    expect(response.body).toEqual({
      error: 'ICMP ping unavailable for this target right now',
    })
  })

  it('returns normalized IP information from the request', async () => {
    const response = await request(app)
      .get('/api/ip')
      .set('X-Forwarded-For', '::ffff:203.0.113.10, 10.0.0.1')
      .set('User-Agent', 'Vitest Agent')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      ip: '203.0.113.10',
      version: 4,
      userAgent: 'Vitest Agent',
    })
  })

  it('falls back to the socket/request IP when no proxy header is present', async () => {
    const response = await request(app).get('/api/ip')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      version: expect.any(Number),
      userAgent: null,
    })
    expect(response.body.ip).toBeTruthy()
  })

  it('returns DNS records for a valid domain', async () => {
    lookupDnsRecordsMock.mockResolvedValue({
      domain: 'example.com',
      queriedAt: '2026-03-20T10:00:00.000Z',
      records: {
        A: ['93.184.216.34'],
        AAAA: [],
        CNAME: [],
        MX: [{ exchange: 'mail.example.com', priority: 10 }],
        TXT: ['v=spf1 include:_spf.example.com ~all'],
        NS: ['ns1.example.com', 'ns2.example.com'],
      },
      warnings: [],
    })

    const response = await request(app).get('/api/dns?domain=Example.COM')

    expect(response.status).toBe(200)
    expect(lookupDnsRecordsMock).toHaveBeenCalledWith('example.com')
    expect(response.body).toMatchObject({
      domain: 'example.com',
      records: {
        A: ['93.184.216.34'],
        MX: [{ exchange: 'mail.example.com', priority: 10 }],
      },
      warnings: [],
    })
  })

  it('rejects invalid DNS lookup input before calling the service', async () => {
    const response = await request(app).get('/api/dns?domain=localhost')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Enter a valid domain or subdomain',
    })
    expect(lookupDnsRecordsMock).not.toHaveBeenCalled()
  })

  it('returns a stable error when DNS lookup fails unexpectedly', async () => {
    lookupDnsRecordsMock.mockRejectedValue(new Error('upstream resolver timeout'))

    const response = await request(app).get('/api/dns?domain=example.com')

    expect(response.status).toBe(502)
    expect(response.body).toEqual({
      error: 'DNS lookup failed',
    })
  })

  it('accepts pasted URLs by normalizing them before lookup', async () => {
    lookupDnsRecordsMock.mockResolvedValue({
      domain: 'example.com',
      queriedAt: '2026-03-20T10:00:00.000Z',
      records: {
        A: ['93.184.216.34'],
        AAAA: [],
        CNAME: [],
        MX: [],
        TXT: [],
        NS: [],
      },
      warnings: [],
    })

    const response = await request(app).get('/api/dns?domain=https://Example.com/docs?q=1')

    expect(response.status).toBe(200)
    expect(lookupDnsRecordsMock).toHaveBeenCalledWith('example.com')
  })

  it('returns empty DNS record sets without treating them as a hard failure', async () => {
    lookupDnsRecordsMock.mockResolvedValue({
      domain: 'example.com',
      queriedAt: '2026-03-20T10:00:00.000Z',
      records: {
        A: [],
        AAAA: [],
        CNAME: [],
        MX: [],
        TXT: [],
        NS: [],
      },
      warnings: [],
    })

    const response = await request(app).get('/api/dns?domain=example.com')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      domain: 'example.com',
      records: {
        A: [],
        AAAA: [],
        CNAME: [],
        MX: [],
        TXT: [],
        NS: [],
      },
      warnings: [],
    })
  })

  it('includes the IP and DNS pages in the sitemap output', async () => {
    const response = await request(app).get('/sitemap.xml').set('Host', 'example.com')

    expect(response.status).toBe(200)
    expect(response.text).toContain('<loc>http://example.com/what-is-my-ip</loc>')
    expect(response.text).toContain('<loc>http://example.com/ip-check</loc>')
    expect(response.text).toContain('<loc>http://example.com/check-my-ip</loc>')
    expect(response.text).toContain('<loc>http://example.com/my-ip-address</loc>')
    expect(response.text).toContain('<loc>http://example.com/ip-lookup</loc>')
    expect(response.text).toContain('<loc>http://example.com/dns-lookup</loc>')
    expect(response.text).toContain('<loc>http://example.com/dns-check</loc>')
    expect(response.text).toContain('<loc>http://example.com/check-dns-records</loc>')
    expect(response.text).toContain('<loc>http://example.com/mx-lookup</loc>')
    expect(response.text).toContain('<loc>http://example.com/txt-lookup</loc>')
  })
})
