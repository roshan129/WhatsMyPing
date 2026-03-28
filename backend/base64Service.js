const INVALID_BASE64_ERROR = 'Invalid Base64 string'

const hasValidBase64Shape = (input) =>
  /^[A-Za-z0-9+/]+={0,2}$/.test(input) && input.length % 4 === 0

const encodeBase64 = (input) => Buffer.from(input, 'utf8').toString('base64')

const decodeBase64 = (input) => {
  const normalizedInput = typeof input === 'string' ? input.trim().replace(/\s+/g, '') : ''

  if (!normalizedInput || !hasValidBase64Shape(normalizedInput)) {
    throw new Error(INVALID_BASE64_ERROR)
  }

  const decodedBuffer = Buffer.from(normalizedInput, 'base64')

  if (decodedBuffer.length === 0 || decodedBuffer.toString('base64') !== normalizedInput) {
    throw new Error(INVALID_BASE64_ERROR)
  }

  return decodedBuffer.toString('utf8')
}

module.exports = {
  INVALID_BASE64_ERROR,
  decodeBase64,
  encodeBase64,
}
