import React, { useState } from 'react'

const ProductForm = ({ products, addProduct }) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedQuantity = String(quantity).trim()
    const trimmedPrice = String(price).trim()

    if (!trimmedName || !trimmedQuantity || !trimmedPrice) {
      alert('All fields are required')
      return
    }

    const parsedQuantity = Number(trimmedQuantity)
    const parsedPrice = Number(trimmedPrice)

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert('Quantity cannot be zero or negative.')
      return
    }

    const nameExists = products.some(
      (product) => product.name.toLowerCase() === trimmedName.toLowerCase(),
    )

    if (nameExists) {
      alert('Product name must be unique.')
      return
    }

    addProduct({
      name: trimmedName,
      quantity: parsedQuantity,
      price: parsedPrice,
    })

    setName('')
    setQuantity('')
    setPrice('')
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="product-name">Product Name</label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          data-testid="product-name-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          data-testid="quantity-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          data-testid="price-input"
        />
      </div>

      <button type="submit" data-testid="add-product-button">
        Add Product
      </button>
    </form>
  )
}

export default ProductForm
