import React, { useState } from 'react'

function ProductForm({ products, addProduct }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (name === '' || quantity === '' || price === '') {
      alert('All fields are required')
      return
    }

    const qty = Number(quantity)
    const prc = Number(price)

    if (qty <= 0) {
      alert('Quantity cannot be zero or negative.')
      return
    }

    const isDuplicate = products.some((product) => product.name === name)
    if (isDuplicate) {
      alert('Product name must be unique.')
      return
    }

    addProduct({
      name,
      quantity: qty,
      price: prc,
    })

    setName('')
    setQuantity('')
    setPrice('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name-input">Product Name</label>
        <input
          id="name-input"
          data-testid="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="quantity-input">Quantity</label>
        <input
          id="quantity-input"
          data-testid="quantity-input"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="price-input">Price</label>
        <input
          id="price-input"
          data-testid="price-input"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button type="submit" data-testid="submit-button">
        Add Product
      </button>
    </form>
  )
}

export default ProductForm
