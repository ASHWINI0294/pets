# URL Shortener (React + JavaScript)

A React URL shortener where users paste a long link, validate it, call a shortening API, and manage a history of recent links with copy-to-clipboard support.

## Features

- URL input with client-side validation (`http://` or `https://`)
- Submit to the [shrtco.de](https://shrtco.de/) API
- Loading, success, and error states
- Submit button disabled while loading or when the URL is invalid
- Recent links history (persisted in `localStorage`)
- One-click copy for any shortened URL

## Run locally

```bash
cd url-shortener
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## StackBlitz

You can also open this folder in [StackBlitz](https://stackblitz.com/) as a Vite + React project and run `npm install` then `npm run dev`.
