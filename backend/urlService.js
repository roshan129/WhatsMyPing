const INVALID_URL_DECODE_ERROR = 'Invalid URL encoded string'

const encodeUrl = (input) => encodeURIComponent(input)

const decodeUrl = (input) => {
  try {
    return decodeURIComponent(input)
  } catch {
    throw new Error(INVALID_URL_DECODE_ERROR)
  }
}

module.exports = {
  INVALID_URL_DECODE_ERROR,
  decodeUrl,
  encodeUrl,
}
