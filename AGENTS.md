# AGENTS.md — Cauang

**What:** Simple expense tracker for Indonesian students (anak kos).
**Stack:** Vanilla HTML/CSS/JS + Tailwind (CDN) + LocalStorage + Chart.js + PWA.
**No build step, no npm.** All JS is served as flat files.

## Commands

- `vercel` — deploy to production
- `vercel --preview` — deploy preview

No dev server expected for MVP — open `index.html` directly or use VS Code Live Server.

## Architecture

- **Pattern:** OOP + MVC (Model-View-Controller)
- **Frontend:** Vanilla JavaScript, Tailwind CSS (CDN)
- **Storage:** LocalStorage (Web API)
- **Hosting:** Vercel
- **PWA:** Manifest.json + Service Worker
- **Chart:** Chart.js

### Project Structure

```
/
├── index.html              # Entry point SPA
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── src/
│   ├── models/             # Data & business logic
│   │   ├── Transaction.js
│   │   ├── Budget.js
│   │   └── Storage.js      # LocalStorage wrapper
│   ├── views/              # Render UI
│   │   ├── DashboardView.js
│   │   ├── AddExpenseView.js
│   │   ├── HistoryView.js
│   │   ├── InsightView.js
│   │   └── SettingsView.js
│   ├── controllers/        # Connect model & view
│   │   ├── ExpenseController.js
│   │   └── AppController.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js
│   └── app.js              # Router / init
└── docs/
    └── PRD.md
```

## Development Workflow

Each feature / task follows this flow:
1. **Planning** — understand requirements, define scope
2. **Tasking** — create task & subtask breakdown (use `todowrite`)
3. **Coding** — implement per PRD & project structure
4. **Testing** — manual test in browser, verify no errors
5. **Commit** — use `git-commit-writer` skill

## Conventions

- **UI language:** Bahasa Indonesia (informal, friendly tone)
- **CSS:** Tailwind utility classes only; no custom CSS files unless unavoidable
- **JS:** ES6+ modules via `<script type="module">` or script tags; no bundler
- **Categories:** Makanan, Minuman/Kopi, Transport/Ojol, Kos, Pulsa/Data, Belanja, Jajan, Lainnya
- **Currency:** IDR (Rp), formatted client-side with `Intl.NumberFormat`
- **Dark mode:** `dark:` Tailwind class toggle via JS

## PWA

Service worker caches app shell (static HTML/JS/CSS). All data stored in LocalStorage — fully offline by default.

## Git Branching Strategy

- Every feature implementation, debugging, or error fix MUST start on a new branch.
- Branch naming: `feat/<name>`, `fix/<name>`, `refactor/<name>`.
- Work exclusively on that branch until complete.
- Ensure no errors before merging to `main`.
- Merge only when verified (app runs, no errors).

## Documentation References

- Read: `docs/documentation-pages.md`
