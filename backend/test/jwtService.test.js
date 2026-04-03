const { INVALID_JWT_ERROR, INVALID_JWT_PAYLOAD_ERROR, decodeJwt } = require('../jwtService')

describe('jwtService', () => {
  it('decodes a valid JWT into header, payload, and metadata', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MTcxMDAwMzYwMH0.signature'

    expect(decodeJwt(token)).toEqual({
      header: {
        alg: 'HS256',
        typ: 'JWT',
      },
      payload: {
        sub: '123',
        iat: 1710000000,
        exp: 1710003600,
      },
      meta: {
        algorithm: 'HS256',
        type: 'JWT',
        issuedAt: '2024-03-09T16:00:00.000Z',
        notBefore: null,
        expiresAt: '2024-03-09T17:00:00.000Z',
        hasSignature: true,
      },
    })
  })

  it('supports Base64URL payloads with URL-safe characters', () => {
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4tdXNlciIsIm5hbWUiOiJKYW5lX0RvZSJ9.signature'

    expect(decodeJwt(token)).toMatchObject({
      header: {
        alg: 'HS256',
      },
      payload: {
        role: 'admin-user',
        name: 'Jane_Doe',
      },
    })
  })

  it('rejects JWTs with an invalid structure', () => {
    expect(() => decodeJwt('not-a-jwt')).toThrow(INVALID_JWT_ERROR)
  })

  it('rejects JWTs with invalid JSON sections', () => {
    expect(() => decodeJwt('bm90LWpzb24=.bm90LWpzb24=.signature')).toThrow(INVALID_JWT_PAYLOAD_ERROR)
  })
})
