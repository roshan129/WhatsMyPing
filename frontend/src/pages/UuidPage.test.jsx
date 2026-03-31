import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { uuidPages } from '../seoContent'
import UuidPage from './UuidPage'

describe('UuidPage', () => {
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

  it('generates UUIDs using the selected count', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        uuids: ['550e8400-e29b-41d4-a716-446655440000'],
      }),
    })

    render(<UuidPage page={uuidPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }))

    expect(await screen.findByLabelText('UUID 1 value')).toHaveTextContent(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/uuid?count=1'))
    expect(document.title).toBe('UUID Generator - Generate UUID v4 Online')
  })

  it('supports generating multiple UUIDs from the dropdown', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        uuids: [
          '550e8400-e29b-41d4-a716-446655440000',
          '7c9e6679-7425-40de-944b-e07fc1f90ae7',
          '16fd2706-8baf-433b-82eb-8c7fada847da',
        ],
      }),
    })

    render(<UuidPage page={uuidPages[0]} />)

    fireEvent.change(screen.getByLabelText('Number of UUIDs'), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }))

    expect(await screen.findByLabelText('UUID 3 value')).toHaveTextContent(
      '16fd2706-8baf-433b-82eb-8c7fada847da'
    )
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/uuid?count=3'))
  })

  it('supports copy-all and per-UUID copy actions', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        uuids: [
          '550e8400-e29b-41d4-a716-446655440000',
          '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        ],
      }),
    })

    render(<UuidPage page={uuidPages[0]} />)

    fireEvent.change(screen.getByLabelText('Number of UUIDs'), {
      target: { value: '2' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }))

    await screen.findByLabelText('UUID 2 value')

    fireEvent.click(screen.getByRole('button', { name: 'Copy UUID 1' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000')

    fireEvent.click(screen.getByRole('button', { name: 'Copy All' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      ['550e8400-e29b-41d4-a716-446655440000', '7c9e6679-7425-40de-944b-e07fc1f90ae7'].join('\n')
    )
    expect(await screen.findByRole('button', { name: 'Copied All' })).toBeInTheDocument()
  })

  it('clears the generated UUID list', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        uuids: ['550e8400-e29b-41d4-a716-446655440000'],
      }),
    })

    render(<UuidPage page={uuidPages[0]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }))
    await screen.findByLabelText('UUID 1 value')

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.queryByLabelText('UUID 1 value')).not.toBeInTheDocument()
    expect(
      screen.getByText('Choose how many UUID v4 values you want, then generate a fresh batch instantly.')
    ).toBeInTheDocument()
  })
})
