import React from 'react'

function ProductList({ products, deleteProduct, restockProduct }) {
  if (products.length === 0) {
    return <p>No products available.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Restock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const needsRestock = product.quantity < 5

          return (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>{needsRestock ? 'Yes' : 'No'}</td>
              <td>
                <button
                  type="button"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
                {needsRestock && (
                  <button
                    type="button"
                    onClick={() => restockProduct(product.id)}
                  >
                    Restock
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ProductList
