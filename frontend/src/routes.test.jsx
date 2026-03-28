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
    expect(getRouteForPath('/').path).toBe('/')
  })

  it('falls back to the default ping test for unknown paths', () => {
    expect(getRouteForPath('/does-not-exist').path).toBe('/ping-test')
  })
})
