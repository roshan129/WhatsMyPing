import { useEffect } from 'react'
import { buildApiUrl, isSimpleAnalyticsEnabled } from './runtimeConfig'

const postAnalytics = (payload) => {
  if (!isSimpleAnalyticsEnabled()) {
    return
  }

  const body = JSON.stringify(payload)
  const endpoint = buildApiUrl('/api/analytics')

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon(endpoint, blob)
    return
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

export const trackPageView = (page) => {
  postAnalytics({
    type: 'pageview',
    path: page.path,
    toolType: page.toolType || 'ping',
    title: page.title,
  })
}

export const trackInteraction = (name, data = {}) => {
  postAnalytics({
    type: 'interaction',
    name,
    ...data,
  })
}

export const usePageTracking = (page) => {
  useEffect(() => {
    trackPageView(page)
  }, [page])
}
