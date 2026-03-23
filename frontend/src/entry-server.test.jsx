import { describe, expect, it } from 'vitest'
import { prerenderRoutes, render } from './entry-server'

describe('prerenderRoutes', () => {
  it('includes the SEO IP, DNS, and JSON routes', () => {
    expect(prerenderRoutes).toContain('/what-is-my-ip')
    expect(prerenderRoutes).toContain('/ip-check')
    expect(prerenderRoutes).toContain('/check-my-ip')
    expect(prerenderRoutes).toContain('/my-ip-address')
    expect(prerenderRoutes).toContain('/ip-lookup')
    expect(prerenderRoutes).toContain('/dns-lookup')
    expect(prerenderRoutes).toContain('/dns-check')
    expect(prerenderRoutes).toContain('/check-dns-records')
    expect(prerenderRoutes).toContain('/mx-lookup')
    expect(prerenderRoutes).toContain('/txt-lookup')
    expect(prerenderRoutes).toContain('/json-formatter')
    expect(prerenderRoutes).toContain('/json-pretty-print')
    expect(prerenderRoutes).toContain('/json-validator')
    expect(prerenderRoutes).toContain('/json-viewer')
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

  it('returns the expected metadata for a DNS page', () => {
    const result = render('/dns-lookup')

    expect(result.head).toMatchObject({
      title: 'DNS Lookup Tool - Check DNS Records Fast',
    })
    expect(result.head.description).toContain('Run a DNS lookup for a domain or subdomain')
    expect(result.appHtml).toContain('Run A DNS Lookup')
  })

  it('returns the expected metadata for a JSON page', () => {
    const result = render('/json-formatter')

    expect(result.head).toMatchObject({
      title: 'JSON Formatter - Format and Validate JSON Online',
    })
    expect(result.head.description).toContain('Format JSON online')
    expect(result.appHtml).toContain('Format JSON Instantly')
  })
})
