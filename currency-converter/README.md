# Currency Converter (React + TypeScript)

A Vite + React currency converter built to run in [StackBlitz](https://stackblitz.com/) or locally.

## Features

- Amount input with positive-number validation
- From / To currency selectors (10 major currencies)
- One-click currency swap
- Convert action with loading, error, and success states
- Formatted result plus unit exchange rate
- Simulated rates so the app works in StackBlitz sandboxes where external FX APIs are often blocked

## Run locally

```bash
cd currency-converter
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Open in StackBlitz

### Option A — Open this folder directly

1. Push this repo (or copy the `currency-converter` folder).
2. In StackBlitz, choose **Vite → React → TypeScript**, or import the `currency-converter` folder.
3. Run `npm install` then `npm run dev` if prompted.

### Option B — Paste into an existing React StackBlitz

See [`STACKBLITZ_COPY_GUIDE.md`](./STACKBLITZ_COPY_GUIDE.md).

## Build

```bash
npm run build
```
