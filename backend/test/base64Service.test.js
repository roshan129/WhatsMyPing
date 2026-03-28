const { INVALID_BASE64_ERROR, decodeBase64, encodeBase64 } = require('../base64Service')

describe('base64Service', () => {
  it('encodes plain text to Base64', () => {
    expect(encodeBase64('Hello, Roswag!')).toBe('SGVsbG8sIFJvc3dhZyE=')
  })

  it('decodes valid Base64 input', () => {
    expect(decodeBase64('SGVsbG8sIFJvc3dhZyE=')).toBe('Hello, Roswag!')
  })

  it('rejects invalid Base64 input', () => {
    expect(() => decodeBase64('not-valid-***')).toThrow(INVALID_BASE64_ERROR)
  })
})
