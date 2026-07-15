import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'

describe('App integration', () => {
  it('shows login first, then dashboard after successful login', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'FinTrackr' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'riya.sharma@example.com')
    await user.type(screen.getByLabelText('Password'), 'riya123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My Dashboard' })).toBeInTheDocument()
    })

    expect(screen.getByText('Riya Sharma')).toBeInTheDocument()
    expect(screen.getByText('Amazon')).toBeInTheDocument()
  })

  it('shows an error for invalid credentials', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Email'), 'riya.sharma@example.com')
    await user.type(screen.getByLabelText('Password'), 'bad-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })

    expect(screen.queryByRole('heading', { name: 'My Dashboard' })).not.toBeInTheDocument()
  })

  it('filters transactions by status after login', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Email'), 'riya.sharma@example.com')
    await user.type(screen.getByLabelText('Password'), 'riya123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(screen.getByText('Amazon')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: 'Failed' }))

    expect(screen.getByText('Uber')).toBeInTheDocument()
    expect(screen.queryByText('Amazon')).not.toBeInTheDocument()
  }, 10000)
})
