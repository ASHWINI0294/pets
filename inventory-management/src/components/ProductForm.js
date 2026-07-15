import React, { useState } from 'react'

function ProductForm({ products = [], addProduct, onAddProduct }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  const submitProduct = addProduct || onAddProduct

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedQuantity = String(quantity).trim()
    const trimmedPrice = String(price).trim()

    // Sample Interaction / Constraints: empty fields
    if (!trimmedName || !trimmedQuantity || !trimmedPrice) {
      alert('All fields are required')
      return
    }

    const parsedQuantity = Number(trimmedQuantity)
    const parsedPrice = Number(trimmedPrice)

    // Constraints: quantity must be a positive number
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert('Quantity cannot be zero or negative.')
      return
    }

    if (Number.isNaN(parsedPrice)) {
      alert('All fields are required')
      return
    }

    // User Action 3: product name must be unique
    const nameExists = products.some((product) => product.name === trimmedName)
    if (nameExists) {
      alert('Product name must be unique.')
      return
    }

    if (typeof submitProduct === 'function') {
      submitProduct({
        name: trimmedName,
        quantity: parsedQuantity,
        price: parsedPrice,
      })
    }

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
          name="name"
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          data-testid="product-name-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          data-testid="quantity-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="text"
          placeholder="Price"
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
export { ProductForm }
