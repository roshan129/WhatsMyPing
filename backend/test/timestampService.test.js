const {
  INVALID_DATE_INPUT_ERROR,
  INVALID_TIMESTAMP_ERROR,
  formatTimestamp,
  parseDateInput,
} = require('../timestampService')

describe('timestampService', () => {
  it('formats Unix seconds input into readable date values', () => {
    expect(formatTimestamp('1710000000')).toMatchObject({
      iso: '2024-03-09T16:00:00.000Z',
      utc: 'Sat, 09 Mar 2024 16:00:00 GMT',
      unixSeconds: 1710000000,
      unixMilliseconds: 1710000000000,
    })
  })

  it('formats Unix milliseconds input into readable date values', () => {
    expect(formatTimestamp('1710000000000')).toMatchObject({
      iso: '2024-03-09T16:00:00.000Z',
      unixSeconds: 1710000000,
      unixMilliseconds: 1710000000000,
    })
  })

  it('parses a valid date input into timestamp values', () => {
    expect(parseDateInput('2024-03-09T16:00:00.000Z')).toMatchObject({
      iso: '2024-03-09T16:00:00.000Z',
      unixSeconds: 1710000000,
      unixMilliseconds: 1710000000000,
    })
  })

  it('rejects invalid timestamp input', () => {
    expect(() => formatTimestamp('hello')).toThrow(INVALID_TIMESTAMP_ERROR)
  })

  it('rejects invalid date input', () => {
    expect(() => parseDateInput('not-a-date')).toThrow(INVALID_DATE_INPUT_ERROR)
  })
})
