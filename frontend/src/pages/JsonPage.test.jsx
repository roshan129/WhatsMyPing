import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import JsonPage from './JsonPage'
import { jsonPages } from '../seoContent'

describe('JsonPage', () => {
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

  it('formats JSON input and renders the formatted output', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        formatted: '{\n  "ok": true\n}',
      }),
    })

    render(<JsonPage page={jsonPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }))

    const output = await screen.findByLabelText('JSON output')
    expect(output).toHaveTextContent('"ok": true')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/json/format'),
      expect.objectContaining({
        method: 'POST',
      })
    )
    expect(document.title).toBe('JSON Formatter - Format and Validate JSON Online')
  })

  it('shows a local error when the input is empty', async () => {
    render(<JsonPage page={jsonPages[0]} />)

    fireEvent.change(screen.getByLabelText('JSON input'), {
      target: { value: '   ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }))

    expect(await screen.findByText('Paste JSON to format it first.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('shows a loading state while the formatter request is in flight', async () => {
    let resolveRequest
    fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      })
    )

    render(<JsonPage page={jsonPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }))

    expect(screen.getByRole('button', { name: 'Formatting…' })).toBeDisabled()

    resolveRequest({
      ok: true,
      json: async () => ({
        valid: true,
        formatted: '{\n  "ok": true\n}',
      }),
    })

    expect(await screen.findByLabelText('JSON output')).toHaveTextContent('"ok": true')
  })

  it('shows a backend validation error for invalid JSON', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        valid: false,
        error: 'Invalid JSON. Please paste a valid JSON object or array.',
        details: 'Unexpected token } in JSON at position 10',
      }),
    })

    render(<JsonPage page={jsonPages[0]} />)

    fireEvent.change(screen.getByLabelText('JSON input'), {
      target: { value: '{"ok":}' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }))

    expect(
      await screen.findByText('Invalid JSON. Please paste a valid JSON object or array.')
    ).toBeInTheDocument()
    expect(screen.getByText('Details: Unexpected token } in JSON at position 10')).toBeInTheDocument()
  })

  it('supports clear and copy actions after formatting', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        formatted: '{\n  "ok": true\n}',
      }),
    })

    render(<JsonPage page={jsonPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }))

    const output = await screen.findByLabelText('JSON output')
    expect(output).toHaveTextContent('"ok": true')

    fireEvent.click(screen.getByRole('button', { name: 'Copy Output' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{\n  "ok": true\n}')
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('JSON input')).toHaveValue('')
    expect(screen.getByLabelText('JSON output')).toHaveTextContent('Formatted JSON will appear here.')
  })
})
