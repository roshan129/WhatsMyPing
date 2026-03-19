import { pageMap } from './seoContent'

export const normalizePath = (pathname) => {
  if (!pathname) {
    return '/'
  }

  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  return normalized || '/'
}

export const getRouteForPath = (pathname) =>
  pageMap[normalizePath(pathname)] ?? pageMap['/ping-test']
