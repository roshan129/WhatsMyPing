const { INVALID_URL_DECODE_ERROR, decodeUrl, encodeUrl } = require('../urlService')

describe('urlService', () => {
  it('encodes plain text for safe URL usage', () => {
    expect(encodeUrl('hello world?foo=bar&x=1')).toBe('hello%20world%3Ffoo%3Dbar%26x%3D1')
  })

  it('decodes valid encoded URL text', () => {
    expect(decodeUrl('hello%20world%3Ffoo%3Dbar%26x%3D1')).toBe('hello world?foo=bar&x=1')
  })

  it('rejects invalid encoded input', () => {
    expect(() => decodeUrl('%E0%A4%A')).toThrow(INVALID_URL_DECODE_ERROR)
  })
})
