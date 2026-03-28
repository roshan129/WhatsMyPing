import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Base64Page from './Base64Page'
import { base64Pages } from '../seoContent'

describe('Base64Page', () => {
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

  it('encodes text input and renders the Base64 output', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        output: 'SGVsbG8=',
      }),
    })

    render(<Base64Page page={base64Pages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Encode To Base64' }))

    expect(await screen.findByLabelText('Base64 output')).toHaveTextContent('SGVsbG8=')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/base64/encode'),
      expect.objectContaining({
        method: 'POST',
      })
    )
    expect(document.title).toBe('Base64 Encode - Encode Text to Base64 Online')
  })

  it('decodes Base64 input and renders the decoded text', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        output: 'Hello from Roswag',
      }),
    })

    render(<Base64Page page={base64Pages[1]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Decode Base64' }))

    expect(await screen.findByLabelText('Decoded text')).toHaveTextContent('Hello from Roswag')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/base64/decode'),
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('shows a backend validation error for invalid Base64 input', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'Invalid Base64 string',
      }),
    })

    render(<Base64Page page={base64Pages[1]} />)

    fireEvent.change(screen.getByLabelText('Base64 input'), {
      target: { value: '***bad***' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Decode Base64' }))

    expect(await screen.findByText('Invalid Base64 string')).toBeInTheDocument()
  })

  it('supports clear and copy actions after converting', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        output: 'SGVsbG8=',
      }),
    })

    render(<Base64Page page={base64Pages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Encode To Base64' }))

    expect(await screen.findByLabelText('Base64 output')).toHaveTextContent('SGVsbG8=')

    fireEvent.click(screen.getByRole('button', { name: 'Copy Output' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('SGVsbG8=')
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Text input')).toHaveValue('')
    expect(screen.getByLabelText('Base64 output')).toHaveTextContent('Converted output will appear here.')
  })
})
