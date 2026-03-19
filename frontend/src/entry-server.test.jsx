import { describe, expect, it } from 'vitest'
import { prerenderRoutes, render } from './entry-server'

describe('prerenderRoutes', () => {
  it('includes the SEO IP routes', () => {
    expect(prerenderRoutes).toContain('/what-is-my-ip')
    expect(prerenderRoutes).toContain('/ip-check')
    expect(prerenderRoutes).toContain('/check-my-ip')
    expect(prerenderRoutes).toContain('/my-ip-address')
    expect(prerenderRoutes).toContain('/ip-lookup')
  })
})

describe('render', () => {
  it('returns the expected metadata for an IP page', () => {
    const result = render('/what-is-my-ip')

    expect(result.head).toMatchObject({
      title: 'What Is My IP Address? Check It Instantly',
    })
    expect(result.head.description).toContain('Find your public IP address instantly')
    expect(result.appHtml).toContain('What Is My IP Address?')
  })
})
