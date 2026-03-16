import { pingPageMap } from './seoContent'

export const getRouteForPath = (pathname) => pingPageMap[pathname] ?? pingPageMap['/ping-test']
