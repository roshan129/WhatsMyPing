import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PingPage from './PingPage'
import { pingPageMap } from '../seoContent'

describe('PingPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('runs a single ping test and renders the result and stats', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'pong',
        target: 'google',
        latencyMs: 22,
        samples: 4,
      }),
    })

    render(<PingPage page={pingPageMap['/ping-google']} />)

    fireEvent.click(screen.getByRole('button', { name: 'Check Ping Once' }))

    const currentPingLabel = await screen.findByText('Current ping')
    expect(currentPingLabel).toBeInTheDocument()
    const resultsCard = currentPingLabel.closest('.results')
    expect(resultsCard).toHaveTextContent('22 ms')
    expect(resultsCard).toHaveTextContent('Excellent')
    expect(screen.getByText(/Session stats \(1 samples\)/)).toBeInTheDocument()
    expect(screen.getByText('google')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/ping?samples=4&target=google'))
    expect(document.title).toBe('Ping Google Server - Test Latency to Google')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain('/ping-google')
  })

  it('shows an error message when the ping request fails', async () => {
    fetch.mockRejectedValue(new Error('network down'))

    render(<PingPage page={pingPageMap['/ping-test']} />)

    fireEvent.click(screen.getByRole('button', { name: 'Check Ping Once' }))

    expect(
      await screen.findByText('Could not reach the ping server. Make sure the backend is running.')
    ).toBeInTheDocument()
  })

  it('resets the active result when the page changes', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        message: 'pong',
        target: 'google',
        latencyMs: 18,
        samples: 4,
      }),
    })

    const { rerender } = render(<PingPage page={pingPageMap['/ping-google']} />)

    fireEvent.click(screen.getByRole('button', { name: 'Check Ping Once' }))
    await screen.findByText('Current ping')

    rerender(<PingPage page={pingPageMap['/ping-cloudflare']} />)

    await waitFor(() => {
      expect(screen.queryByText('Current ping')).not.toBeInTheDocument()
    })
    expect(document.title).toBe('Ping Cloudflare - Test Latency to Cloudflare DNS')
  })
})
