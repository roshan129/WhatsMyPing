const trimTrailingSlash = (value) => value.replace(/\/+$/, '')

const normalizeUrl = (value) => {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return ''
  }

  return trimTrailingSlash(trimmedValue)
}

export const getApiBaseUrl = () => normalizeUrl(import.meta.env.VITE_API_BASE_URL || '')

export const getSiteUrl = () => {
  const configuredSiteUrl = normalizeUrl(import.meta.env.VITE_SITE_URL || '')
  if (configuredSiteUrl) {
    return configuredSiteUrl
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeUrl(window.location.origin)
  }

  return ''
}

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

export const buildCanonicalUrl = (pathname) => {
  const normalizedPath = pathname === '/' ? '/' : pathname
  const siteUrl = getSiteUrl()
  if (!siteUrl) {
    return normalizedPath
  }

  return normalizedPath === '/' ? siteUrl : `${siteUrl}${normalizedPath}`
}

export const isSimpleAnalyticsEnabled = () => import.meta.env.VITE_ENABLE_SIMPLE_ANALYTICS === 'true'
