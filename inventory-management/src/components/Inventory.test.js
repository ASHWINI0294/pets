import React from 'react'
import { render, screen, within } from '@testing-library/react'
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

  const fillProduct = async (user, { name, quantity, price }) => {
    await user.clear(screen.getByTestId('product-name-input'))
    await user.clear(screen.getByTestId('quantity-input'))
    await user.clear(screen.getByTestId('price-input'))

    if (name !== undefined) {
      await user.type(screen.getByTestId('product-name-input'), name)
    }
    if (quantity !== undefined) {
      await user.type(screen.getByTestId('quantity-input'), String(quantity))
    }
    if (price !== undefined) {
      await user.type(screen.getByTestId('price-input'), String(price))
    }
  }

  const addProduct = async (user, product) => {
    await fillProduct(user, product)
    await user.click(screen.getByTestId('add-product-button'))
  }

  it('1. Renders the form with no products in the list', () => {
    render(<Inventory />)

    expect(screen.getByTestId('product-name-input')).toBeInTheDocument()
    expect(screen.getByTestId('quantity-input')).toBeInTheDocument()
    expect(screen.getByTestId('price-input')).toBeInTheDocument()
    expect(screen.getByTestId('add-product-button')).toBeInTheDocument()
    expect(screen.getByTestId('no-products')).toHaveTextContent(
      'No products available.',
    )
  })

  it('2. Initial inputs should be empty', () => {
    render(<Inventory />)

    expect(screen.getByTestId('product-name-input')).toHaveValue('')
    expect(screen.getByTestId('quantity-input')).toHaveValue(null)
    expect(screen.getByTestId('price-input')).toHaveValue(null)
  })

  it('3. Adds a product to the inventory', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await addProduct(user, { name: 'Laptop', quantity: 10, price: 1200 })

    expect(screen.queryByTestId('no-products')).not.toBeInTheDocument()
    expect(screen.getByTestId('product-name-Laptop')).toHaveTextContent('Laptop')
    expect(screen.getByTestId('product-quantity-Laptop')).toHaveTextContent('10')
    expect(screen.getByTestId('product-price-Laptop')).toHaveTextContent(
      '$1200.00',
    )
    expect(screen.getByTestId('product-restock-Laptop')).toHaveTextContent('No')
    expect(screen.getByTestId('product-name-input')).toHaveValue('')
    expect(screen.getByTestId('quantity-input')).toHaveValue(null)
    expect(screen.getByTestId('price-input')).toHaveValue(null)
  })

  it('4. Validates unique product names', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await addProduct(user, { name: 'Laptop', quantity: 10, price: 1200 })
    await addProduct(user, { name: 'Laptop', quantity: 5, price: 900 })

    expect(alertSpy).toHaveBeenCalledWith('Product name must be unique.')
    expect(screen.getAllByTestId(/product-row-/)).toHaveLength(1)
  })

  it('5. Marks a product for restocking and restocks it', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await addProduct(user, { name: 'Mouse', quantity: 3, price: 25 })

    expect(screen.getByTestId('product-restock-Mouse')).toHaveTextContent('Yes')
    expect(screen.getByTestId('restock-button-Mouse')).toBeInTheDocument()

    await user.click(screen.getByTestId('restock-button-Mouse'))

    expect(screen.getByTestId('product-quantity-Mouse')).toHaveTextContent('8')
    expect(screen.getByTestId('product-restock-Mouse')).toHaveTextContent('No')
    expect(screen.queryByTestId('restock-button-Mouse')).not.toBeInTheDocument()
  })

  it('6. Deletes a product from the inventory', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await addProduct(user, { name: 'Laptop', quantity: 10, price: 1200 })
    await addProduct(user, { name: 'Mouse', quantity: 3, price: 25 })

    await user.click(screen.getByTestId('delete-button-Laptop'))

    expect(screen.queryByTestId('product-row-Laptop')).not.toBeInTheDocument()
    expect(screen.getByTestId('product-row-Mouse')).toBeInTheDocument()
  })

  it('7. Does not allow negative stock levels', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await addProduct(user, { name: 'Keyboard', quantity: -2, price: 40 })

    expect(alertSpy).toHaveBeenCalledWith(
      'Quantity cannot be zero or negative.',
    )
    expect(screen.getByTestId('no-products')).toBeInTheDocument()
  })

  it('8. Does not add product when any field is empty and shows alert', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await fillProduct(user, { name: 'Monitor', quantity: 4 })
    await user.click(screen.getByTestId('add-product-button'))

    expect(alertSpy).toHaveBeenCalledWith('All fields are required')
    expect(screen.getByTestId('no-products')).toBeInTheDocument()
  })

  it('9. Restock button visibility based on quantity threshold', async () => {
    const user = userEvent.setup()
    render(<Inventory />)

    await addProduct(user, { name: 'Laptop', quantity: 10, price: 1200 })
    await addProduct(user, { name: 'Mouse', quantity: 3, price: 25 })

    const laptopRow = screen.getByTestId('product-row-Laptop')
    const mouseRow = screen.getByTestId('product-row-Mouse')

    expect(within(laptopRow).queryByText('Restock')).not.toBeInTheDocument()
    expect(within(mouseRow).getByText('Restock')).toBeInTheDocument()
    expect(screen.getByTestId('product-restock-Laptop')).toHaveTextContent('No')
    expect(screen.getByTestId('product-restock-Mouse')).toHaveTextContent('Yes')
  })
})
