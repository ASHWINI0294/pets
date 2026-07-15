import React, { useState } from 'react'
import ProductForm from './ProductForm'
import ProductList from './ProductList'

function Inventory() {
  const [products, setProducts] = useState([])

  const addProduct = (product) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        id: Date.now(),
        name: product.name,
        quantity: product.quantity,
        price: product.price,
      },
    ])
  }

  const deleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id),
    )
  }

  const restockProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 5 }
          : product,
      ),
    )
  }

  return (
    <div>
      <h1>Inventory Tracker</h1>
      <h2>Inventory Management</h2>
      <ProductForm products={products} addProduct={addProduct} />
      <h2>Product List</h2>
      <ProductList
        products={products}
        deleteProduct={deleteProduct}
        restockProduct={restockProduct}
      />
    </div>
  )
}

export default Inventory
