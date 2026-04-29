import { describe, expect, it } from 'vitest'
import { prerenderRoutes, render } from './entry-server'

describe('prerenderRoutes', () => {
  it('includes the SEO IP, DNS, JSON, URL, UUID, JWT, timestamp, and blog routes', () => {
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
    expect(prerenderRoutes).toContain('/jwt-decoder')
    expect(prerenderRoutes).toContain('/decode-jwt')
    expect(prerenderRoutes).toContain('/jwt-parser')
    expect(prerenderRoutes).toContain('/jwt-inspector')
    expect(prerenderRoutes).toContain('/jwt-decoder-online')
    expect(prerenderRoutes).toContain('/timestamp-converter')
    expect(prerenderRoutes).toContain('/unix-timestamp-converter')
    expect(prerenderRoutes).toContain('/epoch-converter')
    expect(prerenderRoutes).toContain('/convert-timestamp')
    expect(prerenderRoutes).toContain('/timestamp-to-date')
    expect(prerenderRoutes).toContain('/blog/what-is-a-ping-test')
    expect(prerenderRoutes).toContain('/blog/what-is-dns')
    expect(prerenderRoutes).toContain('/blog/what-is-an-ip-address')
    expect(prerenderRoutes).toContain('/blog/what-is-json-and-how-to-format-json')
    expect(prerenderRoutes).toContain('/blog/what-is-base64-encoding-and-decoding')
    expect(prerenderRoutes).toContain('/blog/what-is-jwt-and-how-jwt-works')
    expect(prerenderRoutes).toContain('/blog/what-is-url-encoding-and-decoding')
    expect(prerenderRoutes).toContain('/blog/what-is-uuid')
    expect(prerenderRoutes).toContain('/blog/what-is-a-timestamp')
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

  it('returns the expected metadata for a JWT page', () => {
    const result = render('/jwt-decoder')

    expect(result.head).toMatchObject({
      title: 'JWT Decoder - Decode JWT Tokens Online',
    })
    expect(result.head.description).toContain('Decode JWT tokens online instantly')
    expect(result.appHtml).toContain('Decode JWT Tokens Instantly')
  })

  it('returns the expected metadata for a timestamp page', () => {
    const result = render('/timestamp-converter')

    expect(result.head).toMatchObject({
      title: 'Timestamp Converter - Convert Unix Timestamp Online',
    })
    expect(result.head.description).toContain('Convert Unix timestamps online instantly')
    expect(result.appHtml).toContain('Convert Unix Timestamps Instantly')
  })

  it('returns the expected metadata for a blog page', () => {
    const result = render('/blog/what-is-a-ping-test')

    expect(result.head).toMatchObject({
      title: 'What is a Ping Test How It Works and How to Check Your Internet Speed',
    })
    expect(result.head.description).toContain('Learn what a ping test is how it works')
    expect(result.appHtml).toContain('What is a Ping Test How It Works and Why It Matters')
  })

  it('returns the expected metadata for the DNS blog page', () => {
    const result = render('/blog/what-is-dns')

    expect(result.head).toMatchObject({
      title: 'What is DNS and How It Works Complete Guide to DNS Lookup',
    })
    expect(result.head.description).toContain('Learn what DNS is how it works')
    expect(result.appHtml).toContain('What is DNS and How It Works')
  })

  it('returns the expected metadata for the IP blog page', () => {
    const result = render('/blog/what-is-an-ip-address')

    expect(result.head).toMatchObject({
      title: 'What is an IP Address and How It Works Complete Beginner Guide',
    })
    expect(result.head.description).toContain('Learn what an IP address is how it works')
    expect(result.appHtml).toContain('What is an IP Address and How It Works')
  })

  it('returns the expected metadata for the JSON blog page', () => {
    const result = render('/blog/what-is-json-and-how-to-format-json')

    expect(result.head).toMatchObject({
      title: 'What is JSON and How to Format JSON Complete Beginner Guide',
    })
    expect(result.head.description).toContain('Learn what JSON is how it works')
    expect(result.appHtml).toContain('What is JSON and How to Format JSON')
  })

  it('returns the expected metadata for the Base64 blog page', () => {
    const result = render('/blog/what-is-base64-encoding-and-decoding')

    expect(result.head).toMatchObject({
      title: 'What is Base64 Encoding and Decoding Complete Beginner Guide',
    })
    expect(result.head.description).toContain('Learn what Base64 encoding and decoding is')
    expect(result.appHtml).toContain('What is Base64 Encoding and Decoding')
  })

  it('returns the expected metadata for the JWT blog page', () => {
    const result = render('/blog/what-is-jwt-and-how-jwt-works')

    expect(result.head).toMatchObject({
      title: 'What is JWT and How JWT Works Complete Beginner Guide',
    })
    expect(result.head.description).toContain('Learn what JWT is how it works')
    expect(result.appHtml).toContain('What is JWT and How JWT Works')
  })

  it('returns the expected metadata for the URL blog page', () => {
    const result = render('/blog/what-is-url-encoding-and-decoding')

    expect(result.head).toMatchObject({
      title: 'What is URL Encoding and Decoding and How It Works Complete Guide',
    })
    expect(result.head.description).toContain('Learn what URL encoding and decoding is')
    expect(result.appHtml).toContain('What is URL Encoding and Decoding and How It Works')
  })

  it('returns the expected metadata for the UUID blog page', () => {
    const result = render('/blog/what-is-uuid')

    expect(result.head).toMatchObject({
      title: 'What is UUID and How UUID Generation Works Complete Guide',
    })
    expect(result.head.description).toContain('Learn what a UUID is how it works')
    expect(result.appHtml).toContain('What is UUID and How UUID Generation Works')
  })

  it('returns the expected metadata for the timestamp blog page', () => {
    const result = render('/blog/what-is-a-timestamp')

    expect(result.head).toMatchObject({
      title: 'What is a Timestamp and How to Convert Timestamps Complete Guide',
    })
    expect(result.head.description).toContain('Learn what a timestamp is how it works')
    expect(result.appHtml).toContain('What is a Timestamp and How to Convert Timestamps')
  })
})
