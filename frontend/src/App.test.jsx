import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App navigation', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/')
    vi.restoreAllMocks()
  })

  it('scrolls to the top after navigating to another page', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    render(<App initialPath="/tools" />)

    expect(scrollTo).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('link', { name: /Ping Test/ }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ping Test')
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
    })
  })
})
