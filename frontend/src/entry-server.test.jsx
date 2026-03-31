import { describe, expect, it } from 'vitest'
import { prerenderRoutes, render } from './entry-server'

describe('prerenderRoutes', () => {
  it('includes the SEO IP, DNS, JSON, URL, and UUID routes', () => {
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
    expect(prerenderRoutes).toContain('/base64-encode')
    expect(prerenderRoutes).toContain('/base64-decode')
    expect(prerenderRoutes).toContain('/text-to-base64')
    expect(prerenderRoutes).toContain('/base64-to-text')
    expect(prerenderRoutes).toContain('/url-encode')
    expect(prerenderRoutes).toContain('/url-decode')
    expect(prerenderRoutes).toContain('/encode-url')
    expect(prerenderRoutes).toContain('/decode-url')
    expect(prerenderRoutes).toContain('/uuid-generator')
    expect(prerenderRoutes).toContain('/generate-uuid')
    expect(prerenderRoutes).toContain('/uuid-v4-generator')
    expect(prerenderRoutes).toContain('/random-uuid-generator')
    expect(prerenderRoutes).toContain('/uuid-generator-online')
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

  it('returns the expected metadata for a Base64 page', () => {
    const result = render('/base64-encode')

    expect(result.head).toMatchObject({
      title: 'Base64 Encode - Encode Text to Base64 Online',
    })
    expect(result.head.description).toContain('Encode text to Base64 online instantly')
    expect(result.appHtml).toContain('Encode Text To Base64')
  })

  it('returns the expected metadata for a URL page', () => {
    const result = render('/url-encode')

    expect(result.head).toMatchObject({
      title: 'URL Encoder - Encode URLs Online',
    })
    expect(result.head.description).toContain('Encode URLs online')
    expect(result.appHtml).toContain('Encode URL Text Safely')
  })

  it('returns the expected metadata for a UUID page', () => {
    const result = render('/uuid-generator')

    expect(result.head).toMatchObject({
      title: 'UUID Generator - Generate UUID v4 Online',
    })
    expect(result.head.description).toContain('Generate UUID v4 values online instantly')
    expect(result.appHtml).toContain('Generate UUID v4 Values Instantly')
  })
})
