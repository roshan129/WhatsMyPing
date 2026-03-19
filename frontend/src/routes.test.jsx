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
    expect(getRouteForPath('/').path).toBe('/')
  })

  it('falls back to the default ping test for unknown paths', () => {
    expect(getRouteForPath('/does-not-exist').path).toBe('/ping-test')
  })
})
