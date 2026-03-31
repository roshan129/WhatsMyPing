const { generateMultipleUUIDs, generateUUID } = require('../uuidService')

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('uuidService', () => {
  it('generates a valid UUID v4 string', () => {
    expect(generateUUID()).toMatch(UUID_V4_PATTERN)
  })

  it('generates multiple valid UUID v4 strings', () => {
    const uuids = generateMultipleUUIDs(3)

    expect(uuids).toHaveLength(3)
    expect(new Set(uuids).size).toBe(3)
    uuids.forEach((uuid) => {
      expect(uuid).toMatch(UUID_V4_PATTERN)
    })
  })
})
