const INVALID_TIMESTAMP_ERROR = 'Enter a valid Unix timestamp in seconds or milliseconds.'
const INVALID_DATE_INPUT_ERROR = 'Enter a valid date or date-time value.'

const buildTimestampPayload = (date) => {
  const unixMilliseconds = date.getTime()

  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
    unixSeconds: Math.floor(unixMilliseconds / 1000),
    unixMilliseconds,
  }
}

const parseNumericTimestamp = (input) => {
  if (!/^-?\d+$/.test(input)) {
    throw new Error(INVALID_TIMESTAMP_ERROR)
  }

  const parsedValue = Number(input)

  if (!Number.isFinite(parsedValue)) {
    throw new Error(INVALID_TIMESTAMP_ERROR)
  }

  return Math.abs(parsedValue) < 1e12 ? parsedValue * 1000 : parsedValue
}

const formatTimestamp = (input) => {
  const normalizedInput = typeof input === 'string' ? input.trim() : String(input ?? '').trim()
  const date = new Date(parseNumericTimestamp(normalizedInput))

  if (Number.isNaN(date.getTime())) {
    throw new Error(INVALID_TIMESTAMP_ERROR)
  }

  return buildTimestampPayload(date)
}

const parseDateInput = (input) => {
  const normalizedInput = typeof input === 'string' ? input.trim() : ''

  if (!normalizedInput) {
    throw new Error(INVALID_DATE_INPUT_ERROR)
  }

  const parsedValue = Date.parse(normalizedInput)

  if (Number.isNaN(parsedValue)) {
    throw new Error(INVALID_DATE_INPUT_ERROR)
  }

  return buildTimestampPayload(new Date(parsedValue))
}

module.exports = {
  INVALID_DATE_INPUT_ERROR,
  INVALID_TIMESTAMP_ERROR,
  formatTimestamp,
  parseDateInput,
}
