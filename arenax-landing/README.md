# ArenaX — Esports Landing Page

A fully responsive, animated esports tournament landing page built with React + Vite.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
arenax-landing/
├── index.html                     Vite HTML entry
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                   Mounts <App /> into #root, loads global styles
│   ├── App.jsx                    Composes all page sections in order
│   ├── data/
│   │   └── constants.js           Nav links, tournament list, supported titles, ticker copy
│   ├── hooks/
│   │   └── useReveal.js           IntersectionObserver hook for scroll-in animations
│   ├── styles/
│   │   ├── variables.css          Design tokens: colors, fonts (Anton / Chakra Petch / Inter)
│   │   └── global.css             Reset, shared utility classes (.btn, .cut, .section, etc.)
│   └── components/
│       ├── Reveal.jsx             Generic "fade + slide in on scroll" wrapper
│       ├── Navbar/                Sticky nav + mobile slide-in menu
│       ├── Hero/                  Headline, CTAs, animated light beams, ScoreCard
│       ├── Ticker/                Infinite scrolling live-match marquee
│       ├── Tournaments/           Section heading + TournamentCard grid
│       ├── SupportedTitles/       Supported game wordmark strip
│       ├── CTA/                   Closing "Ready to compete?" section
│       └── Footer/                Site footer
```

Each component folder holds its own `.jsx` and matching `.css` file, so styles stay
scoped to the part of the UI they describe instead of living in one giant stylesheet.

## Design notes

- **Palette**: near-black surfaces (`--bg`, `--panel`) with a single acid-lime accent
  (`--green`) — matches a live broadcast/HUD aesthetic.
- **Type**: `Anton` for display headlines, `Chakra Petch` for UI/labels/data (the
  angular, technical feel), `Inter` for body copy.
- **Signature motif**: the angled "cut corner" panel shape (`.cut` / `.cut-sm` in
  `global.css`), reused across the scoreboard, buttons, badges, and cards to tie the
  page together like a broadcast overlay.
- **Motion**: staggered hero load-in, animated score count-up, pulsing live indicators,
  infinite ticker marquee, scroll-triggered reveals, and card hover states. All motion
  respects `prefers-reduced-motion`.
- **No external images**: hero lighting and card thumbnails are CSS gradients/patterns,
  so there's nothing to source, license, or swap out — though you can drop real photos
  into `Hero.css` / `TournamentCard.css` backgrounds if you have brand assets.

## Customizing content

All copy — nav links, tournament cards, supported titles, ticker text — lives in
`src/data/constants.js`. Edit that file to update content without touching any
component code.
