# Apex Arena

A single-page esports tournament platform UI (home, tournaments, live broadcasts,
community sign-up) built with React + Vite.

This was refactored from a single monolithic `.jsx` file into a conventional,
feature-organized component structure.

## Structure

```
apex-arena/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # React DOM entry point
    ├── App.jsx                # Root component: view routing + shared state
    ├── styles/
    │   └── global.css         # All app styles (design tokens live in :root)
    ├── data/                  # Static seed data, separated from UI
    │   ├── tournaments.js
    │   ├── matches.js
    │   ├── games.js
    │   └── perks.js
    └── components/
        ├── common/            # Reusable, presentation-only primitives
        │   ├── HudCard.jsx
        │   ├── Tag.jsx
        │   └── LiveTicker.jsx
        ├── layout/            # App shell
        │   ├── NavBar.jsx
        │   └── Footer.jsx
        ├── home/
        │   ├── HomeView.jsx
        │   └── TournamentCard.jsx
        ├── tournaments/
        │   ├── TournamentsView.jsx
        │   └── TournamentDetail.jsx
        ├── live/
        │   └── LiveView.jsx
        └── community/
            └── CommunityView.jsx
```

## What changed from the original single file

- **One component per file**, grouped by feature area, so each view can be
  found, tested, and changed independently.
- **Data extracted from UI** — `TOURNAMENTS`, `LIVE_MATCHES`, `GAMES`, and
  `PERKS` now live in `src/data/`, so content can be edited without touching
  component logic.
- **CSS moved out of a JS template string** into a real `global.css`, imported
  once in `App.jsx`, so editors get proper CSS syntax highlighting/linting.
- **Consistent naming** for local variables (`activeMatch`, `updateField`,
  `filteredTournaments`, etc.) instead of single-letter names, plus JSDoc
  comments on each component describing its props.
- **No behavior changes** — routing, filtering, registration, and the
  sign-up flow all work exactly as before.

## Getting started

```bash
npm install
npm run dev
```
