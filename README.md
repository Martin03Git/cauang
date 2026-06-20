# Cauang — Catetan Keuangan

A simple, offline-first expense tracker built with vanilla JavaScript. No build step, no bundler, no backend.

## Features

- **Dashboard** — balance overview, today's and weekly summaries
- **Insight** — donut chart, category breakdown, spending analysis
- **Add Expense** — description-based auto-categorization (learns from your existing data; won't suggest until you have at least a few transactions), manual override available
- **History** — date range filter, search, category chips, edit & delete
- **Settings** — monthly budget, reset all data
- **PWA** — installable to home screen, works fully offline

## Stack

- Vanilla JavaScript (MVC pattern)
- Tailwind CSS (CDN)
- Chart.js (CDN)
- LocalStorage (client-side persistence)
- Service Worker + manifest.json (PWA)

## Getting Started

```bash
git clone https://github.com/Martin03Git/cauang.git
cd cauang
open index.html
```

No npm install, no build step required. Works by opening `index.html` directly in a browser.

For development, use VS Code Live Server or any static file server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

## Project Structure

```
├── index.html              # SPA entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── src/
│   ├── models/             # Data & business logic
│   ├── views/              # UI rendering
│   ├── utils/              # Helpers & constants
│   └── app.js              # Bootstrap & router
```

## Deploy

click [here](https://cauang.vercel.app/) to try the app.
