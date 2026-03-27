import { useEffect } from 'react'
import { buildCanonicalUrl } from './runtimeConfig'

const ensureMeta = (selector, attributes) => {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => {
      node.setAttribute(key, value)
    })
    document.head.appendChild(node)
  }

  return node
}

const ensureLink = (selector, attributes) => {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('link')
    Object.entries(attributes).forEach(([key, value]) => {
      node.setAttribute(key, value)
    })
    document.head.appendChild(node)
  }

  return node
}

export const applyPageSeo = ({ title, description, path }) => {
  document.title = title

  ensureMeta('meta[name="description"]', { name: 'description' }).setAttribute('content', description)
  ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title)
  ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', description)
  ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }).setAttribute('content', 'summary_large_image')

  const canonicalUrl = buildCanonicalUrl(path)
  if (!canonicalUrl) {
    return
  }

  ensureLink('link[rel="canonical"]', { rel: 'canonical' }).setAttribute('href', canonicalUrl)
  ensureMeta('meta[property="og:url"]', { property: 'og:url' }).setAttribute('content', canonicalUrl)
}

export const usePageSeo = (page) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    applyPageSeo(page)
  }, [page])
}
