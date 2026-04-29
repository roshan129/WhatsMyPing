const request = require('supertest')
const { createApp } = require('../app')
const dnsService = require('../dnsService')
const jsonService = require('../jsonService')
const base64Service = require('../base64Service')
const urlService = require('../urlService')
const uuidService = require('../uuidService')
const jwtService = require('../jwtService')
const timestampService = require('../timestampService')
const pingService = require('../pingService')

describe('backend API', () => {
  let measurePingMock
  let measureTargetMock
  let lookupDnsRecordsMock
  let formatJsonMock
  let encodeBase64Mock
  let decodeBase64Mock
  let encodeUrlMock
  let decodeUrlMock
  let generateMultipleUUIDsMock
  let decodeJwtMock
  let formatTimestampMock
  let parseDateInputMock
  let app

  beforeEach(() => {
    measurePingMock = vi.fn()
    measureTargetMock = vi.fn()
    lookupDnsRecordsMock = vi.fn()
    formatJsonMock = vi.fn()
    encodeBase64Mock = vi.fn()
    decodeBase64Mock = vi.fn()
    encodeUrlMock = vi.fn()
    decodeUrlMock = vi.fn()
    generateMultipleUUIDsMock = vi.fn()
    decodeJwtMock = vi.fn()
    formatTimestampMock = vi.fn()
    parseDateInputMock = vi.fn()
    app = createApp({
      ...pingService,
      ...dnsService,
      ...jsonService,
      ...base64Service,
      ...urlService,
      ...uuidService,
      ...jwtService,
      ...timestampService,
      measurePing: measurePingMock,
      measureTarget: measureTargetMock,
      lookupDnsRecords: lookupDnsRecordsMock,
      formatJson: formatJsonMock,
      encodeBase64: encodeBase64Mock,
      decodeBase64: decodeBase64Mock,
      encodeUrl: encodeUrlMock,
      decodeUrl: decodeUrlMock,
      generateMultipleUUIDs: generateMultipleUUIDsMock,
      decodeJwt: decodeJwtMock,
      formatTimestamp: formatTimestampMock,
      parseDateInput: parseDateInputMock,
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

  it('formats valid JSON input through the API', async () => {
    formatJsonMock.mockReturnValue('{\n  "ok": true\n}')

    const response = await request(app)
      .post('/api/json/format')
      .send({ input: '{"ok":true}' })

    expect(response.status).toBe(200)
    expect(formatJsonMock).toHaveBeenCalledWith('{"ok":true}')
    expect(response.body).toEqual({
      valid: true,
      formatted: '{\n  "ok": true\n}',
    })
  })

  it('rejects empty JSON input before calling the formatter', async () => {
    const response = await request(app)
      .post('/api/json/format')
      .send({ input: '   ' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      valid: false,
      error: 'Input required',
    })
    expect(formatJsonMock).not.toHaveBeenCalled()
  })

  it('returns a stable validation error for invalid JSON', async () => {
    formatJsonMock.mockImplementation(() => {
      const error = new Error('Invalid JSON. Please paste a valid JSON object or array.')
      error.details = 'Unexpected token } in JSON at position 10'
      throw error
    })

    const response = await request(app)
      .post('/api/json/format')
      .send({ input: '{"ok":}' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      valid: false,
      error: 'Invalid JSON. Please paste a valid JSON object or array.',
      details: 'Unexpected token } in JSON at position 10',
    })
  })

  it('encodes valid Base64 input through the API', async () => {
    encodeBase64Mock.mockReturnValue('SGVsbG8=')

    const response = await request(app)
      .post('/api/base64/encode')
      .send({ input: 'Hello' })

    expect(response.status).toBe(200)
    expect(encodeBase64Mock).toHaveBeenCalledWith('Hello')
    expect(response.body).toEqual({
      output: 'SGVsbG8=',
    })
  })

  it('decodes valid Base64 input through the API', async () => {
    decodeBase64Mock.mockReturnValue('Hello')

    const response = await request(app)
      .post('/api/base64/decode')
      .send({ input: 'SGVsbG8=' })

    expect(response.status).toBe(200)
    expect(decodeBase64Mock).toHaveBeenCalledWith('SGVsbG8=')
    expect(response.body).toEqual({
      output: 'Hello',
    })
  })

  it('rejects empty Base64 input before encoding', async () => {
    const response = await request(app)
      .post('/api/base64/encode')
      .send({ input: '' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Input required',
    })
    expect(encodeBase64Mock).not.toHaveBeenCalled()
  })

  it('returns a stable error for invalid Base64 decode input', async () => {
    decodeBase64Mock.mockImplementation(() => {
      throw new Error('Invalid Base64 string')
    })

    const response = await request(app)
      .post('/api/base64/decode')
      .send({ input: '***bad***' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Invalid Base64 string',
    })
  })

  it('encodes valid URL input through the API', async () => {
    encodeUrlMock.mockReturnValue('hello%20world')

    const response = await request(app)
      .post('/api/url/encode')
      .send({ input: 'hello world' })

    expect(response.status).toBe(200)
    expect(encodeUrlMock).toHaveBeenCalledWith('hello world')
    expect(response.body).toEqual({
      output: 'hello%20world',
    })
  })

  it('decodes valid URL input through the API', async () => {
    decodeUrlMock.mockReturnValue('hello world')

    const response = await request(app)
      .post('/api/url/decode')
      .send({ input: 'hello%20world' })

    expect(response.status).toBe(200)
    expect(decodeUrlMock).toHaveBeenCalledWith('hello%20world')
    expect(response.body).toEqual({
      output: 'hello world',
    })
  })

  it('rejects empty URL input before encoding', async () => {
    const response = await request(app)
      .post('/api/url/encode')
      .send({ input: '' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Input required',
    })
    expect(encodeUrlMock).not.toHaveBeenCalled()
  })

  it('returns a stable error for invalid URL decode input', async () => {
    decodeUrlMock.mockImplementation(() => {
      throw new Error('Invalid URL encoded string')
    })

    const response = await request(app)
      .post('/api/url/decode')
      .send({ input: '%E0%A4%A' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Invalid URL encoded string',
    })
  })

  it('returns one UUID by default', async () => {
    generateMultipleUUIDsMock.mockReturnValue(['550e8400-e29b-41d4-a716-446655440000'])

    const response = await request(app).get('/api/uuid')

    expect(response.status).toBe(200)
    expect(generateMultipleUUIDsMock).toHaveBeenCalledWith(1)
    expect(response.body).toEqual({
      uuids: ['550e8400-e29b-41d4-a716-446655440000'],
    })
  })

  it('supports generating multiple UUIDs', async () => {
    generateMultipleUUIDsMock.mockReturnValue([
      '550e8400-e29b-41d4-a716-446655440000',
      '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      '16fd2706-8baf-433b-82eb-8c7fada847da',
    ])

    const response = await request(app).get('/api/uuid?count=3')

    expect(response.status).toBe(200)
    expect(generateMultipleUUIDsMock).toHaveBeenCalledWith(3)
    expect(response.body.uuids).toHaveLength(3)
  })

  it('caps UUID generation requests at 20', async () => {
    generateMultipleUUIDsMock.mockReturnValue(Array.from({ length: 20 }, (_, index) => `uuid-${index + 1}`))

    const response = await request(app).get('/api/uuid?count=50')

    expect(response.status).toBe(200)
    expect(generateMultipleUUIDsMock).toHaveBeenCalledWith(20)
    expect(response.body.uuids).toHaveLength(20)
  })

  it('decodes valid JWT input through the API', async () => {
    decodeJwtMock.mockReturnValue({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '123' },
      meta: {
        algorithm: 'HS256',
        type: 'JWT',
        issuedAt: null,
        notBefore: null,
        expiresAt: null,
        hasSignature: true,
      },
    })

    const response = await request(app)
      .post('/api/jwt/decode')
      .send({ input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature' })

    expect(response.status).toBe(200)
    expect(decodeJwtMock).toHaveBeenCalledWith('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature')
    expect(response.body).toMatchObject({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '123' },
      meta: { hasSignature: true },
    })
  })

  it('rejects empty JWT input before decoding', async () => {
    const response = await request(app)
      .post('/api/jwt/decode')
      .send({ input: '   ' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Input required',
    })
    expect(decodeJwtMock).not.toHaveBeenCalled()
  })

  it('returns a stable error for malformed JWT input', async () => {
    decodeJwtMock.mockImplementation(() => {
      throw new Error('Enter a valid JWT with header, payload, and signature.')
    })

    const response = await request(app)
      .post('/api/jwt/decode')
      .send({ input: 'not-a-jwt' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Enter a valid JWT with header, payload, and signature.',
    })
  })

  it('formats a timestamp into readable date values through the API', async () => {
    formatTimestampMock.mockReturnValue({
      iso: '2024-03-09T16:00:00.000Z',
      utc: 'Sat, 09 Mar 2024 16:00:00 GMT',
      local: 'Sat Mar 09 2024 16:00:00 GMT+0000 (Coordinated Universal Time)',
      unixSeconds: 1710000000,
      unixMilliseconds: 1710000000000,
    })

    const response = await request(app)
      .post('/api/timestamp/format')
      .send({ input: '1710000000' })

    expect(response.status).toBe(200)
    expect(formatTimestampMock).toHaveBeenCalledWith('1710000000')
    expect(response.body).toMatchObject({
      iso: '2024-03-09T16:00:00.000Z',
      unixSeconds: 1710000000,
      unixMilliseconds: 1710000000000,
    })
  })

  it('parses a date into timestamp values through the API', async () => {
    parseDateInputMock.mockReturnValue({
      iso: '2024-03-09T16:00:00.000Z',
      utc: 'Sat, 09 Mar 2024 16:00:00 GMT',
      local: 'Sat Mar 09 2024 16:00:00 GMT+0000 (Coordinated Universal Time)',
      unixSeconds: 1710000000,
      unixMilliseconds: 1710000000000,
    })

    const response = await request(app)
      .post('/api/timestamp/parse')
      .send({ input: '2024-03-09T16:00:00.000Z' })

    expect(response.status).toBe(200)
    expect(parseDateInputMock).toHaveBeenCalledWith('2024-03-09T16:00:00.000Z')
    expect(response.body).toMatchObject({
      iso: '2024-03-09T16:00:00.000Z',
      unixSeconds: 1710000000,
    })
  })

  it('rejects empty timestamp conversion input', async () => {
    const response = await request(app)
      .post('/api/timestamp/format')
      .send({ input: '   ' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Input required',
    })
    expect(formatTimestampMock).not.toHaveBeenCalled()
  })

  it('returns a stable error for invalid timestamp input', async () => {
    formatTimestampMock.mockImplementation(() => {
      throw new Error('Enter a valid Unix timestamp in seconds or milliseconds.')
    })

    const response = await request(app)
      .post('/api/timestamp/format')
      .send({ input: 'bad-value' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Enter a valid Unix timestamp in seconds or milliseconds.',
    })
  })

  it('includes the IP, DNS, JSON, URL, UUID, JWT, and timestamp pages in the sitemap output', async () => {
    const response = await request(app).get('/sitemap.xml').set('Host', 'example.com')

    expect(response.status).toBe(200)
    const expectedPaths = [
      '/what-is-my-ip/',
      '/ip-check/',
      '/check-my-ip/',
      '/my-ip-address/',
      '/ip-lookup/',
      '/dns-lookup/',
      '/dns-check/',
      '/check-dns-records/',
      '/mx-lookup/',
      '/txt-lookup/',
      '/json-formatter/',
      '/json-pretty-print/',
      '/json-validator/',
      '/json-viewer/',
      '/base64-encode/',
      '/base64-decode/',
      '/text-to-base64/',
      '/base64-to-text/',
      '/url-encode/',
      '/url-decode/',
      '/encode-url/',
      '/decode-url/',
      '/uuid-generator/',
      '/generate-uuid/',
      '/uuid-v4-generator/',
      '/random-uuid-generator/',
      '/uuid-generator-online/',
      '/jwt-decoder/',
      '/decode-jwt/',
      '/jwt-parser/',
      '/jwt-inspector/',
      '/jwt-decoder-online/',
      '/timestamp-converter/',
      '/unix-timestamp-converter/',
      '/epoch-converter/',
      '/convert-timestamp/',
      '/timestamp-to-date/',
      '/blog/what-is-a-ping-test/',
      '/blog/what-is-dns/',
      '/blog/what-is-an-ip-address/',
      '/blog/what-is-json-and-how-to-format-json/',
      '/blog/what-is-base64-encoding-and-decoding/',
      '/blog/what-is-jwt-and-how-jwt-works/',
      '/blog/what-is-url-encoding-and-decoding/',
      '/blog/what-is-uuid/',
      '/blog/what-is-a-timestamp/',
    ]

    expectedPaths.forEach((routePath) => {
      expect(response.text).toContain(`<loc>http://example.com${routePath}</loc>`)
    })
  })
})
