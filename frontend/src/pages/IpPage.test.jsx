import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import IpPage from './IpPage'
import { ipPages } from '../seoContent'

describe('IpPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('loads and displays IP lookup data', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        ip: '203.0.113.10',
        version: 4,
        userAgent: 'Vitest Browser',
      }),
    })

    render(<IpPage page={ipPages[0]} />)

    expect(screen.getByText(/Checking your current public IP address/i)).toBeInTheDocument()
    expect(await screen.findByText('203.0.113.10')).toBeInTheDocument()
    const connectionDetails = screen.getByText('Connection details').closest('.stats')
    expect(connectionDetails).toHaveTextContent('IPv4')
    expect(connectionDetails).toHaveTextContent('Vitest Browser')
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/ip'))
    expect(document.title).toBe('What Is My IP Address? Check It Instantly')
  })

  it('shows an error when the lookup request fails', async () => {
    fetch.mockRejectedValue(new Error('lookup failed'))

    render(<IpPage page={ipPages[0]} />)

    expect(
      await screen.findByText('Could not load your IP information. Make sure the backend is running.')
    ).toBeInTheDocument()
  })
})
