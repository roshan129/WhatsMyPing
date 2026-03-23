const validateJson = (input) => {
  if (typeof input !== 'string') {
    return {
      valid: false,
      error: 'Input must be a JSON string',
    }
  }

  try {
    const parsed = JSON.parse(input)
    return {
      valid: true,
      parsed,
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid JSON. Please paste a valid JSON object or array.',
      details: error.message,
    }
  }
}

const formatJson = (input) => {
  const validation = validateJson(input)

  if (!validation.valid) {
    const error = new Error(validation.error)
    error.code = 'INVALID_JSON'
    error.details = validation.details || null
    throw error
  }

  return JSON.stringify(validation.parsed, null, 2)
}

module.exports = {
  formatJson,
  validateJson,
}
