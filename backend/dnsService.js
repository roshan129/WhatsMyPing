const { promises: dns } = require('dns')

const MISSING_DNS_CODES = new Set(['ENODATA', 'ENOTFOUND', 'ENOENT', 'ENOTIMP'])

const normalizeDomain = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmedValue = value.trim().toLowerCase()
  if (!trimmedValue) {
    return null
  }

  let candidate = trimmedValue

  if (candidate.includes('://')) {
    try {
      const parsedUrl = new URL(candidate)
      candidate = parsedUrl.hostname || ''
    } catch {
      return null
    }
  }

  candidate = candidate
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
    .split(/[/?#]/, 1)[0]
    .replace(/:\d+$/, '')

  return candidate.endsWith('.') ? candidate.slice(0, -1) : candidate
}

const isValidDomain = (value) => {
  const domain = normalizeDomain(value)
  if (!domain) {
    return false
  }

  if (
    domain.includes('://') ||
    domain.includes('/') ||
    domain.includes('?') ||
    domain.includes('#') ||
    domain.length > 253
  ) {
    return false
  }

  const labels = domain.split('.')
  if (labels.length < 2) {
    return false
  }

  const hostnameLabelPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i
  const tldPattern = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i

  return labels.every((label, index) => {
    if (!label || label.length > 63) {
      return false
    }

    if (index === labels.length - 1) {
      return tldPattern.test(label)
    }

    return hostnameLabelPattern.test(label)
  })
}

const validateDomain = (value) => {
  const domain = normalizeDomain(value)

  if (!domain) {
    return { domain: null, error: 'Domain is required' }
  }

  if (!isValidDomain(domain)) {
    return { domain: null, error: 'Enter a valid domain or subdomain' }
  }

  return { domain, error: null }
}

const toSortedStrings = (values) => [...values].filter(Boolean).map(String).sort((a, b) => a.localeCompare(b))

const formatMxRecords = (records) =>
  [...records]
    .map((record) => ({
      exchange: record.exchange || null,
      priority: record.priority,
      isNullMx: !record.exchange,
    }))
    .sort((left, right) => {
      const leftExchange = left.exchange || ''
      const rightExchange = right.exchange || ''
      return left.priority - right.priority || leftExchange.localeCompare(rightExchange)
    })

const recordLookupConfig = {
  A: {
    resolve: (resolver, domain) => resolver.resolve4(domain),
    format: (records) => toSortedStrings(records),
  },
  AAAA: {
    resolve: (resolver, domain) => resolver.resolve6(domain),
    format: (records) => toSortedStrings(records),
  },
  CNAME: {
    resolve: (resolver, domain) => resolver.resolveCname(domain),
    format: (records) => toSortedStrings(records),
  },
  MX: {
    resolve: (resolver, domain) => resolver.resolveMx(domain),
    format: formatMxRecords,
  },
  TXT: {
    resolve: (resolver, domain) => resolver.resolveTxt(domain),
    format: (records) =>
      toSortedStrings(records.map((segments) => (Array.isArray(segments) ? segments.join('') : String(segments)))),
  },
  NS: {
    resolve: (resolver, domain) => resolver.resolveNs(domain),
    format: (records) => toSortedStrings(records),
  },
}

const lookupDnsRecords = async (domain, resolver = dns) => {
  const lookups = await Promise.all(
    Object.entries(recordLookupConfig).map(async ([type, config]) => {
      try {
        const records = await config.resolve(resolver, domain)
        return {
          type,
          records: config.format(records),
          warning: null,
        }
      } catch (error) {
        if (MISSING_DNS_CODES.has(error?.code)) {
          return {
            type,
            records: [],
            warning: null,
          }
        }

        return {
          type,
          records: [],
          warning: `${type} lookup failed`,
        }
      }
    })
  )

  return {
    domain,
    queriedAt: new Date().toISOString(),
    records: Object.fromEntries(lookups.map(({ type, records }) => [type, records])),
    warnings: lookups.filter((lookup) => lookup.warning).map((lookup) => lookup.warning),
  }
}

module.exports = {
  isValidDomain,
  lookupDnsRecords,
  normalizeDomain,
  validateDomain,
}
