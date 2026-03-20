import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DnsPage from './DnsPage'
import { dnsPages } from '../seoContent'

describe('DnsPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('submits a domain lookup and renders grouped DNS records', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        domain: 'example.com',
        queriedAt: '2026-03-20T10:00:00.000Z',
        records: {
          A: ['93.184.216.34'],
          AAAA: [],
          CNAME: [],
          MX: [{ exchange: 'mail.example.com', priority: 10 }],
          TXT: ['v=spf1 include:_spf.example.com ~all'],
          NS: ['ns1.example.com', 'ns2.example.com'],
        },
        warnings: [],
      }),
    })

    render(<DnsPage page={dnsPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Check DNS Records' }))

    expect(await screen.findByText('example.com')).toBeInTheDocument()
    expect(screen.getByText('Priority 10 - mail.example.com')).toBeInTheDocument()
    expect(screen.getByText('No AAAA records were returned for this lookup.')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dns?domain=example.com'))
    expect(document.title).toBe('DNS Lookup Tool - Check DNS Records Fast')
  })

  it('shows a validation error from the backend', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'Enter a valid domain or subdomain',
      }),
    })

    render(<DnsPage page={dnsPages[0]} />)

    fireEvent.change(screen.getByLabelText('Domain or subdomain'), {
      target: { value: 'https://example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Check DNS Records' }))

    expect(await screen.findByText('Enter a valid domain or subdomain')).toBeInTheDocument()
  })

  it('shows a loading state while the DNS request is in flight', async () => {
    let resolveRequest
    fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )

    render(<DnsPage page={dnsPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Check DNS Records' }))

    expect(screen.getByRole('button', { name: 'Checking DNS…' })).toBeDisabled()

    resolveRequest({
      ok: true,
      json: async () => ({
        domain: 'example.com',
        queriedAt: '2026-03-20T10:00:00.000Z',
        records: {
          A: [],
          AAAA: [],
          CNAME: [],
          MX: [],
          TXT: [],
          NS: [],
        },
        warnings: [],
      }),
    })

    expect(await screen.findByText('example.com')).toBeInTheDocument()
  })

  it('accepts pasted URLs and sends them to the backend for cleanup', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        domain: 'example.com',
        queriedAt: '2026-03-20T10:00:00.000Z',
        records: {
          A: [],
          AAAA: [],
          CNAME: [],
          MX: [],
          TXT: [],
          NS: [],
        },
        warnings: [],
      }),
    })

    render(<DnsPage page={dnsPages[0]} />)

    fireEvent.change(screen.getByLabelText('Domain or subdomain'), {
      target: { value: 'https://Example.com/docs?q=1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Check DNS Records' }))

    expect(await screen.findByText('example.com')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/dns?domain=https%3A%2F%2FExample.com%2Fdocs%3Fq%3D1')
    )
  })

  it('renders null MX records with clear copy', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        domain: 'example.com',
        queriedAt: '2026-03-20T10:00:00.000Z',
        records: {
          A: [],
          AAAA: [],
          CNAME: [],
          MX: [{ exchange: null, priority: 0, isNullMx: true }],
          TXT: [],
          NS: [],
        },
        warnings: [],
      }),
    })

    render(<DnsPage page={dnsPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Check DNS Records' }))

    expect(await screen.findByText('Null MX (this domain does not accept email)')).toBeInTheDocument()
  })
})
