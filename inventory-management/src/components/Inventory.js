import React, { useState } from 'react'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import './Inventory.css'

function Inventory() {
  const [products, setProducts] = useState([])

  const addProduct = (product) => {
    setProducts((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        name: product.name,
        quantity: product.quantity,
        price: product.price,
      },
    ])
  }

  const deleteProduct = (id) => {
    setProducts((current) => current.filter((product) => product.id !== id))
  }

  // User Action 4: increase quantity by 5
  const restockProduct = (id) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 5 }
          : product,
      ),
    )
  }

  return (
    <div className="inventory">
      <h1>Inventory Tracker</h1>

      <div className="inventory-management">
        <h2>Inventory Management</h2>
        <ProductForm products={products} addProduct={addProduct} />
      </div>

      <div className="product-list-section">
        <h2>Product List</h2>
        <ProductList
          products={products}
          deleteProduct={deleteProduct}
          restockProduct={restockProduct}
        />
      </div>
    </div>
  )
}

export default Inventory
export { Inventory }
