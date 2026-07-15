import React from 'react'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from '../App'

describe('Inventory Management System', () => {
  let alertSpy

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    alertSpy.mockRestore()
  })

  const addProduct = (name, quantity, price) => {
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: name },
    })
    fireEvent.change(screen.getByTestId('quantity-input'), {
      target: { value: String(quantity) },
    })
    fireEvent.change(screen.getByTestId('price-input'), {
      target: { value: String(price) },
    })
    fireEvent.click(screen.getByTestId('submit-button'))
  }

  it('1. Renders the form with no products in the list', () => {
    render(<App />)

    expect(screen.getByTestId('name-input')).toBeInTheDocument()
    expect(screen.getByTestId('quantity-input')).toBeInTheDocument()
    expect(screen.getByTestId('price-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    expect(screen.getByText('No products available.')).toBeInTheDocument()
  })

  it('2. Initial inputs should be empty', () => {
    render(<App />)

    expect(screen.getByTestId('name-input')).toHaveValue('')
    expect(screen.getByTestId('quantity-input')).toHaveValue(null)
    expect(screen.getByTestId('price-input')).toHaveValue(null)
  })

  it('3. Adds a product to the inventory', () => {
    render(<App />)

    addProduct('Laptop', 10, 1200)

    expect(screen.queryByText('No products available.')).not.toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('$1200.00')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByTestId('name-input')).toHaveValue('')
    expect(screen.getByTestId('quantity-input')).toHaveValue(null)
    expect(screen.getByTestId('price-input')).toHaveValue(null)
  })

  it('4. Validates unique product names', () => {
    render(<App />)

    addProduct('Laptop', 10, 1200)
    addProduct('Laptop', 5, 900)

    expect(alertSpy).toHaveBeenCalledWith('Product name must be unique.')
    expect(screen.getAllByText('Laptop')).toHaveLength(1)
  })

  it('5. Marks a product for restocking and restocks it', () => {
    render(<App />)

    addProduct('Mouse', 3, 25)

    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restock' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restock' }))

    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Restock' })).not.toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('6. Deletes a product from the inventory', () => {
    render(<App />)

    addProduct('Laptop', 10, 1200)
    addProduct('Mouse', 3, 25)

    const laptopDelete = screen.getAllByRole('button', { name: 'Delete' })[0]
    fireEvent.click(laptopDelete)

    expect(screen.queryByText('Laptop')).not.toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
  })

  it('7. Does not allow negative stock levels', () => {
    render(<App />)

    addProduct('Keyboard', -2, 40)

    expect(alertSpy).toHaveBeenCalledWith(
      'Quantity cannot be zero or negative.',
    )
    expect(screen.getByText('No products available.')).toBeInTheDocument()
  })

  it('8. Does not add product when any field is empty and shows alert', () => {
    render(<App />)

    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Monitor' },
    })
    fireEvent.change(screen.getByTestId('quantity-input'), {
      target: { value: '4' },
    })
    fireEvent.click(screen.getByTestId('submit-button'))

    expect(alertSpy).toHaveBeenCalledWith('All fields are required')
    expect(screen.getByText('No products available.')).toBeInTheDocument()
  })

  it('9. Restock button visibility based on quantity threshold', () => {
    render(<App />)

    addProduct('Laptop', 10, 1200)
    addProduct('Mouse', 3, 25)

    const rows = screen.getAllByRole('row')
    // rows[0] is header
    const laptopRow = rows[1]
    const mouseRow = rows[2]

    expect(within(laptopRow).queryByRole('button', { name: 'Restock' })).not.toBeInTheDocument()
    expect(within(mouseRow).getByRole('button', { name: 'Restock' })).toBeInTheDocument()
    expect(within(laptopRow).getByText('No')).toBeInTheDocument()
    expect(within(mouseRow).getByText('Yes')).toBeInTheDocument()
  })
})
