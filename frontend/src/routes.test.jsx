import { describe, expect, it } from 'vitest'
import { getRouteForPath, normalizePath } from './routes'

describe('normalizePath', () => {
  it('normalizes empty and trailing-slash paths', () => {
    expect(normalizePath()).toBe('/')
    expect(normalizePath('/ping-google/')).toBe('/ping-google')
  })
})

describe('getRouteForPath', () => {
  it('returns the matching route config for known paths', () => {
    expect(getRouteForPath('/ping-google').target).toBe('google')
    expect(getRouteForPath('/what-is-my-ip').toolType).toBe('ip')
    expect(getRouteForPath('/dns-lookup').toolType).toBe('dns')
    expect(getRouteForPath('/json-formatter').toolType).toBe('json')
    expect(getRouteForPath('/base64-encode').toolType).toBe('base64')
    expect(getRouteForPath('/base64-decode').mode).toBe('decode')
    expect(getRouteForPath('/url-encode').toolType).toBe('url')
    expect(getRouteForPath('/url-decode').mode).toBe('decode')
    expect(getRouteForPath('/uuid-generator').toolType).toBe('uuid')
    expect(getRouteForPath('/uuid-v4-generator').shortLabel).toBe('UUID v4')
    expect(getRouteForPath('/jwt-decoder').toolType).toBe('jwt')
    expect(getRouteForPath('/jwt-parser').shortLabel).toBe('JWT Parser')
    expect(getRouteForPath('/timestamp-converter').toolType).toBe('timestamp')
    expect(getRouteForPath('/convert-timestamp').mode).toBe('parse')
    expect(getRouteForPath('/blog/what-is-a-ping-test').toolType).toBe(
      'blog'
    )
    expect(getRouteForPath('/blog/what-is-dns').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-an-ip-address').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-json-and-how-to-format-json').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-base64-encoding-and-decoding').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-jwt-and-how-jwt-works').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-url-encoding-and-decoding').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-uuid').toolType).toBe('blog')
    expect(getRouteForPath('/blog/what-is-a-timestamp').toolType).toBe('blog')
    expect(getRouteForPath('/').path).toBe('/')
  })

  it('falls back to the default ping test for unknown paths', () => {
    expect(getRouteForPath('/does-not-exist').path).toBe('/ping-test')
  })
})
