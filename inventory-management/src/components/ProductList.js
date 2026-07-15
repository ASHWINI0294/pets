import React from 'react'

// Note: prices formatted with exactly two decimal places (e.g., "$20.50")
const formatPrice = (price) => `$${Number(price).toFixed(2)}`

function ProductList({
  products = [],
  deleteProduct,
  restockProduct,
  onDelete,
  onRestock,
}) {
  const handleDelete = deleteProduct || onDelete
  const handleRestock = restockProduct || onRestock

  // Initial State / empty list
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
          // User Action 2: restock status "Yes" when quantity < 5
          const needsRestock = product.quantity < 5

          return (
            <tr key={product.id ?? product.name} data-testid={`product-row-${product.name}`}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{needsRestock ? 'Yes' : 'No'}</td>
              <td>
                <button
                  type="button"
                  data-testid={`delete-button-${product.name}`}
                  onClick={() => {
                    if (handleDelete) {
                      handleDelete(product.id)
                    }
                  }}
                >
                  Delete
                </button>
                {/* User Action 2/4: Restock button only when quantity < 5; disappears after restock */}
                {needsRestock ? (
                  <button
                    type="button"
                    data-testid={`restock-button-${product.name}`}
                    onClick={() => {
                      if (handleRestock) {
                        handleRestock(product.id)
                      }
                    }}
                  >
                    Restock
                  </button>
                ) : null}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ProductList
export { ProductList }
