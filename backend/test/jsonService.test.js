const { formatJson, validateJson } = require('../jsonService')

describe('jsonService', () => {
  it('formats valid JSON with 2-space indentation', () => {
    expect(formatJson('{"ok":true,"items":[1,2]}')).toBe('{\n  "ok": true,\n  "items": [\n    1,\n    2\n  ]\n}')
  })

  it('returns a valid result for parseable JSON', () => {
    expect(validateJson('{"hello":"world"}')).toMatchObject({
      valid: true,
      parsed: { hello: 'world' },
    })
  })

  it('returns a stable error result for invalid JSON', () => {
    expect(validateJson('{"hello":}')).toMatchObject({
      valid: false,
      error: 'Invalid JSON. Please paste a valid JSON object or array.',
      details: expect.any(String),
    })
  })

  it('throws a useful error when formatting invalid JSON', () => {
    expect(() => formatJson('{"hello":}')).toThrow()
  })
})
