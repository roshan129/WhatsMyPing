const {
  isValidDomain,
  lookupDnsRecords,
  normalizeDomain,
  validateDomain,
} = require('../dnsService')

describe('dnsService', () => {
  it('normalizes casing, whitespace, and trailing dots', () => {
    expect(normalizeDomain('  ExAmPle.Com.  ')).toBe('example.com')
  })

  it('normalizes pasted URLs and strips paths or ports', () => {
    expect(normalizeDomain('https://Example.com/path?q=1')).toBe('example.com')
    expect(normalizeDomain('api.example.com/docs')).toBe('api.example.com')
    expect(normalizeDomain('example.com:8080')).toBe('example.com')
  })

  it('accepts valid domains and subdomains', () => {
    expect(isValidDomain('example.com')).toBe(true)
    expect(isValidDomain('api.status.example.com')).toBe(true)
  })

  it('rejects malformed input after normalization', () => {
    expect(isValidDomain('')).toBe(false)
    expect(isValidDomain('localhost')).toBe(false)
    expect(isValidDomain('-bad.example.com')).toBe(false)
  })

  it('returns stable validation errors', () => {
    expect(validateDomain('')).toEqual({
      domain: null,
      error: 'Domain is required',
    })
    expect(validateDomain('https://example.com')).toEqual({ domain: 'example.com', error: null })
    expect(validateDomain('example.com/path')).toEqual({ domain: 'example.com', error: null })
  })

  it('returns normalized records and warnings from DNS lookups', async () => {
    const resolver = {
      resolve4: vi.fn().mockResolvedValue(['93.184.216.34']),
      resolve6: vi.fn().mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENODATA' })),
      resolveCname: vi.fn().mockResolvedValue(['example.net']),
      resolveMx: vi.fn().mockResolvedValue([{ exchange: 'mail.example.com', priority: 10 }]),
      resolveTxt: vi.fn().mockResolvedValue([['v=spf1', ' include:_spf.example.com', ' ~all']]),
      resolveNs: vi.fn().mockRejectedValue(new Error('resolver exploded')),
    }

    const result = await lookupDnsRecords('example.com', resolver)

    expect(result).toMatchObject({
      domain: 'example.com',
      records: {
        A: ['93.184.216.34'],
        AAAA: [],
        CNAME: ['example.net'],
        MX: [{ exchange: 'mail.example.com', priority: 10 }],
        TXT: ['v=spf1 include:_spf.example.com ~all'],
        NS: [],
      },
      warnings: ['NS lookup failed'],
    })
    expect(result.queriedAt).toEqual(expect.any(String))
  })

  it('normalizes null MX responses into a clearer shape', async () => {
    const resolver = {
      resolve4: vi.fn().mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENODATA' })),
      resolve6: vi.fn().mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENODATA' })),
      resolveCname: vi.fn().mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENODATA' })),
      resolveMx: vi.fn().mockResolvedValue([{ exchange: '', priority: 0 }]),
      resolveTxt: vi.fn().mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENODATA' })),
      resolveNs: vi.fn().mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENODATA' })),
    }

    const result = await lookupDnsRecords('example.com', resolver)

    expect(result.records.MX).toEqual([
      {
        exchange: null,
        priority: 0,
        isNullMx: true,
      },
    ])
  })
})
