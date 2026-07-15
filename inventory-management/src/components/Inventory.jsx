import React, { useState } from 'react'
import ProductForm from './ProductForm.jsx'
import ProductList from './ProductList.jsx'

const Inventory = () => {
  const [products, setProducts] = useState([])

  const addProduct = (product) => {
    setProducts((current) => [
      ...current,
      {
        ...product,
        id: Date.now() + Math.random(),
      },
    ])
  }

  const deleteProduct = (id) => {
    setProducts((current) => current.filter((product) => product.id !== id))
  }

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
      <section className="inventory-management">
        <h2>Inventory Management</h2>
        <ProductForm products={products} addProduct={addProduct} />
      </section>
      <section className="product-list-section">
        <h2>Product List</h2>
        <ProductList
          products={products}
          deleteProduct={deleteProduct}
          restockProduct={restockProduct}
        />
      </section>
    </div>
  )
}

export default Inventory
