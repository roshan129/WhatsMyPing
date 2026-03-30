const crypto = require('crypto')

const generateUUID = () => crypto.randomUUID()

const generateMultipleUUIDs = (count = 1) =>
  Array.from({ length: count }, () => crypto.randomUUID())

module.exports = {
  generateUUID,
  generateMultipleUUIDs,
}
