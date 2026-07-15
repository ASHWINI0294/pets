import React from 'react'

const formatPrice = (price) => `$${Number(price).toFixed(2)}`

const ProductList = ({ products, deleteProduct, restockProduct }) => {
  if (!products.length) {
    return <p data-testid="no-products">No products available.</p>
  }

  return (
    <table className="product-table" data-testid="product-table">
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
            <tr key={product.id} data-testid={`product-row-${product.name}`}>
              <td data-testid={`product-name-${product.name}`}>{product.name}</td>
              <td data-testid={`product-quantity-${product.name}`}>
                {product.quantity}
              </td>
              <td data-testid={`product-price-${product.name}`}>
                {formatPrice(product.price)}
              </td>
              <td data-testid={`product-restock-${product.name}`}>
                {needsRestock ? 'Yes' : 'No'}
              </td>
              <td>
                <button
                  type="button"
                  data-testid={`delete-button-${product.name}`}
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
                {needsRestock && (
                  <button
                    type="button"
                    data-testid={`restock-button-${product.name}`}
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
