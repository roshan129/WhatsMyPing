const INVALID_JWT_ERROR = 'Enter a valid JWT with header, payload, and signature.'
const INVALID_JWT_PAYLOAD_ERROR = 'Could not decode this JWT. Make sure the token is Base64URL encoded JSON.'

const decodeBase64Url = (value) => {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  return Buffer.from(padded, 'base64').toString('utf8')
}

const formatUnixTimestamp = (value) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }

  return new Date(value * 1000).toISOString()
}

const parseJwtSection = (value) => {
  try {
    return JSON.parse(decodeBase64Url(value))
  } catch {
    throw new Error(INVALID_JWT_PAYLOAD_ERROR)
  }
}

const decodeJwt = (token) => {
  const parts = typeof token === 'string' ? token.trim().split('.') : []

  if (parts.length !== 3 || parts.some((part) => !part.length)) {
    throw new Error(INVALID_JWT_ERROR)
  }

  const [encodedHeader, encodedPayload, signature] = parts
  const header = parseJwtSection(encodedHeader)
  const payload = parseJwtSection(encodedPayload)

  return {
    header,
    payload,
    meta: {
      algorithm: typeof header.alg === 'string' ? header.alg : null,
      type: typeof header.typ === 'string' ? header.typ : null,
      issuedAt: formatUnixTimestamp(payload.iat),
      notBefore: formatUnixTimestamp(payload.nbf),
      expiresAt: formatUnixTimestamp(payload.exp),
      hasSignature: Boolean(signature),
    },
  }
}

module.exports = {
  INVALID_JWT_ERROR,
  INVALID_JWT_PAYLOAD_ERROR,
  decodeJwt,
}
