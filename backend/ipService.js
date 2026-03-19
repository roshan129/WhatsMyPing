const net = require('net')

const normalizeIp = (rawIp) => {
  if (typeof rawIp !== 'string') {
    return null
  }

  const trimmedIp = rawIp.trim()
  if (!trimmedIp) {
    return null
  }

  const withoutZoneId = trimmedIp.split('%')[0]

  if (withoutZoneId.startsWith('::ffff:')) {
    const ipv4Candidate = withoutZoneId.slice('::ffff:'.length)
    if (net.isIP(ipv4Candidate) === 4) {
      return ipv4Candidate
    }
  }

  return withoutZoneId
}

const detectIpVersion = (ip) => {
  const normalizedIp = normalizeIp(ip)
  if (!normalizedIp) {
    return null
  }

  return net.isIP(normalizedIp) || null
}

const getRequestIp = (req) => {
  const forwardedForHeader = req.headers['x-forwarded-for']
  const forwardedIp =
    typeof forwardedForHeader === 'string' ? forwardedForHeader.split(',')[0] : null

  return normalizeIp(forwardedIp || req.ip || req.socket?.remoteAddress || null)
}

module.exports = {
  normalizeIp,
  detectIpVersion,
  getRequestIp,
}
