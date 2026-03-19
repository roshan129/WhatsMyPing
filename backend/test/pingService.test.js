const { clampSamples } = require('../pingService')

describe('clampSamples', () => {
  it('defaults to 4 when the input is missing or invalid', () => {
    expect(clampSamples()).toBe(4)
    expect(clampSamples('nope')).toBe(4)
  })

  it('clamps values to the supported 1-5 range', () => {
    expect(clampSamples('0')).toBe(1)
    expect(clampSamples('2')).toBe(2)
    expect(clampSamples('10')).toBe(5)
  })
})
