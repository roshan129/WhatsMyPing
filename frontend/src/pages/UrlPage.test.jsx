import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import UrlPage from './UrlPage'
import { urlPages } from '../seoContent'

describe('UrlPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn(),
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('encodes text input and renders the encoded output', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        output: 'hello%20world',
      }),
    })

    render(<UrlPage page={urlPages[0]} />)

    fireEvent.change(screen.getByLabelText('Text or URL input'), {
      target: { value: 'hello world' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Encode URL Text' }))

    expect(await screen.findByLabelText('URL-encoded output')).toHaveTextContent('hello%20world')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/url/encode'),
      expect.objectContaining({
        method: 'POST',
      })
    )
    expect(document.title).toBe('URL Encoder - Encode URLs Online')
  })

  it('decodes encoded text and renders the decoded output', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        output: 'hello world',
      }),
    })

    render(<UrlPage page={urlPages[1]} />)

    fireEvent.change(screen.getByLabelText('URL-encoded input'), {
      target: { value: 'hello%20world' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Decode URL Text' }))

    expect(await screen.findByLabelText('Decoded URL output')).toHaveTextContent('hello world')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/url/decode'),
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('shows a backend validation error for invalid URL decode input', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'Invalid URL encoded string',
      }),
    })

    render(<UrlPage page={urlPages[1]} />)

    fireEvent.change(screen.getByLabelText('URL-encoded input'), {
      target: { value: '%E0%A4%A' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Decode URL Text' }))

    expect(await screen.findByText('Invalid URL encoded string')).toBeInTheDocument()
  })

  it('supports clear and copy actions after converting', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        output: 'hello%20world',
      }),
    })

    render(<UrlPage page={urlPages[0]} />)

    fireEvent.change(screen.getByLabelText('Text or URL input'), {
      target: { value: 'hello world' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Encode URL Text' }))

    expect(await screen.findByLabelText('URL-encoded output')).toHaveTextContent('hello%20world')

    fireEvent.click(screen.getByRole('button', { name: 'Copy Output' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello%20world')
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Text or URL input')).toHaveValue('')
    expect(screen.getByLabelText('URL-encoded output')).toHaveTextContent('Converted output will appear here.')
  })
})
