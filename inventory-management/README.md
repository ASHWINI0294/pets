# Inventory Management

React inventory tracker with product add, delete, and restock flows.

## Components (`.js`)

- `src/components/Inventory.js`
- `src/components/ProductForm.js`
- `src/components/ProductList.js`

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Behavior

- Empty form and `No products available.` on load
- Validate required fields, unique names, and positive quantity
- Restock status is `Yes` when quantity is less than 5
- Restock adds 5 units and hides the Restock button when quantity reaches 5+
- Prices render as `$XX.XX`
