import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { timestampPages } from '../seoContent'
import TimestampPage from './TimestampPage'

describe('TimestampPage', () => {
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

  it('converts a Unix timestamp into readable output', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        iso: '2024-03-09T16:00:00.000Z',
        utc: 'Sat, 09 Mar 2024 16:00:00 GMT',
        local: 'Sat Mar 09 2024 16:00:00 GMT+0000 (Coordinated Universal Time)',
        unixSeconds: 1710000000,
        unixMilliseconds: 1710000000000,
      }),
    })

    render(<TimestampPage page={timestampPages[0]} />)

    fireEvent.change(screen.getByLabelText('Unix timestamp input'), {
      target: { value: '1710000000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Convert Timestamp' }))

    expect(await screen.findByLabelText('ISO output')).toHaveTextContent('2024-03-09T16:00:00.000Z')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/timestamp/format'),
      expect.objectContaining({
        method: 'POST',
      })
    )
    expect(document.title).toBe('Timestamp Converter - Convert Unix Timestamp Online')
  })

  it('converts a date input into timestamp values', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        iso: '2024-03-09T16:00:00.000Z',
        utc: 'Sat, 09 Mar 2024 16:00:00 GMT',
        local: 'Sat Mar 09 2024 16:00:00 GMT+0000 (Coordinated Universal Time)',
        unixSeconds: 1710000000,
        unixMilliseconds: 1710000000000,
      }),
    })

    render(<TimestampPage page={timestampPages[3]} />)

    fireEvent.change(screen.getByLabelText('Date or date-time input'), {
      target: { value: '2024-03-09T16:00:00.000Z' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Convert Date' }))

    expect(await screen.findByLabelText('Unix seconds output')).toHaveTextContent('1710000000')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/timestamp/parse'),
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('shows a backend validation error for invalid timestamp input', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'Enter a valid Unix timestamp in seconds or milliseconds.',
      }),
    })

    render(<TimestampPage page={timestampPages[0]} />)

    fireEvent.change(screen.getByLabelText('Unix timestamp input'), {
      target: { value: 'bad-value' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Convert Timestamp' }))

    expect(await screen.findByText('Enter a valid Unix timestamp in seconds or milliseconds.')).toBeInTheDocument()
  })

  it('supports copying the primary conversion result', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        iso: '2024-03-09T16:00:00.000Z',
        utc: 'Sat, 09 Mar 2024 16:00:00 GMT',
        local: 'Sat Mar 09 2024 16:00:00 GMT+0000 (Coordinated Universal Time)',
        unixSeconds: 1710000000,
        unixMilliseconds: 1710000000000,
      }),
    })

    render(<TimestampPage page={timestampPages[0]} />)

    fireEvent.change(screen.getByLabelText('Unix timestamp input'), {
      target: { value: '1710000000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Convert Timestamp' }))

    await screen.findByLabelText('ISO output')

    fireEvent.click(screen.getByRole('button', { name: 'Copy ISO' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('2024-03-09T16:00:00.000Z')
  })
})
