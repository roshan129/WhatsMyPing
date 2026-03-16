import { pingPageMap } from './seoContent'

export const normalizePath = (pathname) => {
  if (!pathname) {
    return '/'
  }

  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  return normalized || '/'
}

export const getRouteForPath = (pathname) =>
  pingPageMap[normalizePath(pathname)] ?? pingPageMap['/ping-test']
