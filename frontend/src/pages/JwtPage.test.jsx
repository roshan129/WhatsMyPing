import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { jwtPages } from '../seoContent'
import JwtPage from './JwtPage'

describe('JwtPage', () => {
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

  it('decodes a JWT and renders header, payload, and metadata', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        header: { alg: 'HS256', typ: 'JWT' },
        payload: { sub: '123', exp: 1710003600 },
        meta: {
          algorithm: 'HS256',
          type: 'JWT',
          issuedAt: null,
          notBefore: null,
          expiresAt: '2024-03-09T17:00:00.000Z',
          hasSignature: true,
        },
      }),
    })

    render(<JwtPage page={jwtPages[0]} />)

    fireEvent.change(screen.getByLabelText('JWT input'), {
      target: { value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE3MTAwMDM2MDB9.signature' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Decode JWT' }))

    expect(await screen.findByLabelText('Decoded JWT header')).toHaveTextContent('"alg": "HS256"')
    expect(screen.getByLabelText('Decoded JWT payload')).toHaveTextContent('"sub": "123"')
    expect(screen.getByText('2024-03-09T17:00:00.000Z')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/jwt/decode'),
      expect.objectContaining({
        method: 'POST',
      })
    )
    expect(document.title).toBe('JWT Decoder - Decode JWT Tokens Online')
  })

  it('shows a backend validation error for malformed JWT input', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'Enter a valid JWT with header, payload, and signature.',
      }),
    })

    render(<JwtPage page={jwtPages[0]} />)

    fireEvent.change(screen.getByLabelText('JWT input'), {
      target: { value: 'bad-token' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Decode JWT' }))

    expect(await screen.findByText('Enter a valid JWT with header, payload, and signature.')).toBeInTheDocument()
  })

  it('supports copy actions for decoded header and payload', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        header: { alg: 'HS256' },
        payload: { sub: '123' },
        meta: {
          algorithm: 'HS256',
          type: null,
          issuedAt: null,
          notBefore: null,
          expiresAt: null,
          hasSignature: true,
        },
      }),
    })

    render(<JwtPage page={jwtPages[0]} />)

    fireEvent.change(screen.getByLabelText('JWT input'), {
      target: { value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Decode JWT' }))

    await screen.findByLabelText('Decoded JWT payload')

    fireEvent.click(screen.getByRole('button', { name: 'Copy Header' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{\n  "alg": "HS256"\n}')

    fireEvent.click(screen.getByRole('button', { name: 'Copy Payload' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{\n  "sub": "123"\n}')
  })
})
