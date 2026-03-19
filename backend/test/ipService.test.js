const { detectIpVersion, getRequestIp, normalizeIp } = require('../ipService')

describe('ipService', () => {
  it('normalizes IPv4-mapped IPv6 addresses', () => {
    expect(normalizeIp('::ffff:127.0.0.1')).toBe('127.0.0.1')
  })

  it('preserves plain IPv6 addresses while removing zone ids', () => {
    expect(normalizeIp('fe80::1%lo0')).toBe('fe80::1')
  })

  it('detects the correct IP version after normalization', () => {
    expect(detectIpVersion('::ffff:192.168.0.10')).toBe(4)
    expect(detectIpVersion('2001:db8::1')).toBe(6)
    expect(detectIpVersion('not-an-ip')).toBe(null)
  })

  it('prefers the first proxy-forwarded IP when present', () => {
    const ip = getRequestIp({
      headers: {
        'x-forwarded-for': '203.0.113.5, 10.0.0.1',
      },
      ip: '10.0.0.1',
      socket: { remoteAddress: '10.0.0.1' },
    })

    expect(ip).toBe('203.0.113.5')
  })
})
