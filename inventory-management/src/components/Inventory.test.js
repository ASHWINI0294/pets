import React from 'react'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import Inventory from './Inventory'

describe('Inventory Management System', () => {
  let alertSpy

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    alertSpy.mockRestore()
  })

  const fillAndAdd = async (user, { name, quantity, price }) => {
    await user.clear(screen.getByLabelText(/product name/i))
    await user.clear(screen.getByLabelText(/^quantity$/i))
    await user.clear(screen.getByLabelText(/^price$/i))
    await user.type(screen.getByLabelText(/product name/i), name)
    await user.type(screen.getByLabelText(/^quantity$/i), String(quantity))
    await user.type(screen.getByLabelText(/^price$/i), String(price))
    await user.click(screen.getByRole('button', { name: /add product/i }))
  }

  it('1. Renders the form with no products in the list', () => {
    render(<Inventory />)

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^quantity$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^price$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument()
    expect(screen.getByText('No products available.')).toBeInTheDocument()
  })

  it('2. Initial inputs should be empty', () => {
    render(<Inventory />)

    expect(screen.getByLabelText(/product name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^quantity$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^price$/i)).toHaveValue('')
  })

  it('3. Adds a product to the inventory', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillAndAdd(user, { name: 'Laptop', quantity: 10, price: 1200 })

    expect(screen.queryByText('No products available.')).not.toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByLabelText(/product name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^quantity$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^price$/i)).toHaveValue('')
  })

  it('4. Validates unique product names', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillAndAdd(user, { name: 'Laptop', quantity: 10, price: 1200 })
    await fillAndAdd(user, { name: 'Laptop', quantity: 5, price: 900 })

    expect(alertSpy).toHaveBeenCalledWith('Product name must be unique.')
    expect(screen.getAllByText('Laptop')).toHaveLength(1)
  })

  it('5. Marks a product for restocking and restocks it', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillAndAdd(user, { name: 'Mouse', quantity: 3, price: 25 })

    const row = screen.getByTestId('product-row-Mouse')
    expect(within(row).getByText('Yes')).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: /restock/i })).toBeInTheDocument()

    await user.click(within(row).getByRole('button', { name: /restock/i }))

    expect(within(row).getByText('8')).toBeInTheDocument()
    expect(within(row).getByText('No')).toBeInTheDocument()
    expect(within(row).queryByRole('button', { name: /restock/i })).not.toBeInTheDocument()
  })

  it('6. Deletes a product from the inventory', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillAndAdd(user, { name: 'Laptop', quantity: 10, price: 1200 })
    await fillAndAdd(user, { name: 'Mouse', quantity: 3, price: 25 })

    await user.click(screen.getByTestId('delete-button-Laptop'))

    expect(screen.queryByText('Laptop')).not.toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
  })

  it('7. Does not allow negative stock levels', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillAndAdd(user, { name: 'Keyboard', quantity: -2, price: 40 })

    expect(alertSpy).toHaveBeenCalledWith(
      'Quantity cannot be zero or negative.',
    )
    expect(screen.getByText('No products available.')).toBeInTheDocument()
  })

  it('8. Does not add product when any field is empty and shows alert', () => {
    render(<Inventory />)

    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: 'Monitor' },
    })
    fireEvent.change(screen.getByLabelText(/^quantity$/i), {
      target: { value: '4' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add product/i }))

    expect(alertSpy).toHaveBeenCalledWith('All fields are required')
    expect(screen.getByText('No products available.')).toBeInTheDocument()
  })

  it('9. Restock button visibility based on quantity threshold', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillAndAdd(user, { name: 'Laptop', quantity: 10, price: 1200 })
    await fillAndAdd(user, { name: 'Mouse', quantity: 3, price: 25 })

    const laptopRow = screen.getByTestId('product-row-Laptop')
    const mouseRow = screen.getByTestId('product-row-Mouse')

    expect(within(laptopRow).queryByRole('button', { name: /restock/i })).not.toBeInTheDocument()
    expect(within(mouseRow).getByRole('button', { name: /restock/i })).toBeInTheDocument()
    expect(within(laptopRow).getByText('No')).toBeInTheDocument()
    expect(within(mouseRow).getByText('Yes')).toBeInTheDocument()
  })
})
