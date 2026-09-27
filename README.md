# Currency Flow

A fast, real-time currency converter with historical rate charts, a travel
budgeting mode, favorites, and locally-stored recent conversions.

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # preview the production build locally
```

No API key or `.env` file is required. Live and historical rates come from
the [Frankfurter API](https://www.frankfurter.app/) (European Central Bank
data), which is free and keyless — so there's nothing to protect on the
frontend. If the network request fails for any reason (offline, blocked,
rate-limited), the app falls back to deterministic, clearly-labeled sample
data so the UI keeps working instead of breaking.

## Project structure

```
src/
  components/   UI components (converter, chart, travel mode, favorites, recents, icons...)
  hooks/        useExchangeRate, useHistoricalRates, useTravelBudget, useFavorites,
                useRecentConversions, useTheme, useDebounce
  services/     exchangeRateApi.ts (Frankfurter client + mock fallback),
                database.ts (SQLite via sql.js), currencyMeta.ts
  types/        shared TypeScript types
  utils/        formatting helpers, constants, mock data generator
```

## Notable implementation details

- **Recent conversions are stored in a real SQLite database** running in the
  browser via [sql.js](https://sql.js.org) (SQLite compiled to WebAssembly).
  The database is serialized to `localStorage` after every write, so history
  survives page reloads without any backend or server. Favorites use plain
  `localStorage`, since they're a simpler set with no query needs.
- **Historical granularity**: Frankfurter only publishes daily rates. The
  30-day-through-5-year ranges use genuine historical data; the 1-day range
  layers a simulated intraday path on top of the real latest close and says
  so in the UI, rather than silently faking precision the data doesn't have.
- **Validation**: amount fields reject empty, non-numeric, negative, zero,
  and unreasonably large input before any network call is made.
- Light/dark mode is applied before first paint (a small inline script in
  `index.html`) to avoid a flash of the wrong theme, and is persisted to
  `localStorage`.

## Design

An understated, editorial look inspired by a Parisian exchange bureau: an
ivory paper background, deep ink-navy text and dark mode, a single brass
accent color, Fraunces for display type paired with Inter for body and
tabular numerals.
