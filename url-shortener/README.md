# URL Shortener — StackBlitz (React + JavaScript)

StackBlitz already gives you the Vite + React boilerplate. You only need to replace two files.

## Step-by-step

### 1. Open StackBlitz

Go to [stackblitz.com](https://stackblitz.com) and start a **React + JavaScript** project (Vite template).

### 2. Replace `src/App.jsx`

Delete the default counter/demo code and paste in the contents of `src/App.jsx` from this folder.

### 3. Replace `src/App.css`

Delete the default styles and paste in the contents of `src/App.css` from this folder.

### 4. (Optional) Update `src/index.css`

Replace the body styles with the contents of `src/index.css` for the page background. You can skip this if you prefer the default StackBlitz look.

### 5. Save and test

StackBlitz hot-reloads automatically. Try:

1. Type an invalid URL → **Shorten** stays disabled
2. Type `https://example.com/some/long/path` → click **Shorten**
3. See the loading state, then the short link
4. Click **Copy** on the result or in **Recent links**

## What the app does

| Feature | How |
|--------|-----|
| URL validation | `new URL()` — must be `http://` or `https://` |
| API | [shrtco.de](https://shrtco.de/) — no API key |
| Loading | Spinner + disabled button |
| Success / error | Conditional rendering from state |
| History | Saved in `localStorage` |
| Copy | `navigator.clipboard.writeText()` |

## Files you do **not** need to change

- `src/main.jsx`
- `index.html`
- `package.json`
- `vite.config.js`
