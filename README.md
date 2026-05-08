# README.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend (run from repo root)
npm run dev          # dev server at localhost:5173
npm run build        # build + postbuild SEO scripts
npm run lint         # ESLint
npm run preview      # preview production build

# Backend (run from clinic-backend/)
npm run develop      # Strapi with hot-reload
npm run start        # Strapi without hot-reload
npm run build        # rebuild Strapi admin panel
```

## Architecture

**Full-stack**: React 18 + Vite frontend, Strapi CMS backend (`clinic-backend/`).

The frontend proxies `/api/*` and `/uploads/*` to the Strapi backend (default `http://localhost:1337`). All API requests go through `src/api/foundation.js`, which centralises URL building, JSON fetching with fallback, and media resolution.

**Environment variables** (`.env`):

- `VITE_API_URL` / `VITE_STRAPI_URL` — Strapi base URL
- `VITE_IMAGEKIT_MEDIA_URL_ENDPOINT` — ImageKit endpoint for `/uploads/` images
- `VITE_IMAGEKIT_SITE_URL_ENDPOINT` — ImageKit endpoint for `/images/` static assets
- `VITE_GA_ID` — Google Analytics measurement ID

**Routing**: All routes are in `src/App.jsx` using React Router v6. Every page is lazy-loaded. The app shows a session-scoped `PageLoader` splash only on first visit.

**Pages** live in `src/pages/`. Each page typically composes sections and reusable components. Common service-page pattern: `ServicesCardHero` → `ServicesIntroText` → `ServicesPriceSection`.

**Reusable components** are in `src/components/`. Key ones:

- `ServicesCardHero` — hero for all service pages
- `ServicesPriceSection` — fetches and renders price tables from Strapi; caches results in `localStorage`
- `SectionTypes` — flexible section renderer for rich CMS content
- `InfoGridSection` — grid layout used across multiple pages

**Sections** (`src/sections/`) are larger layout blocks used on the home page and shared across pages (Header, Footer, DoctorsSection, BranchesSection, etc.).

**API layer** (`src/api/`):

- `foundation.js` — base fetch helpers, `resolveMedia()` for Strapi image objects, ImageKit URL optimisation (srcset, format, quality), `fetchWithEndpointFallback()` for retrying across multiple endpoint names
- `doctorsApi.js` — fetches doctors, branches, specialisations
- `newsApi.js` — fetches news articles and themes

**Data that does not come from the API** lives in `src/data/` (e.g. `branchesCatalog.js` for static branch metadata) and `src/sections/branchesCatalog.js`.

**Design system** is in `src/design-system/`:

- `ui.constants.js` — frozen `UI` object with typography, spacing, colour tokens
- `tokens/` — raw design tokens

**Lib utilities** (`src/lib/`):

- `analytics.js` — GA4 init/consent-gated tracking
- `routeImagePrefetch.js` — prefetches hero images on hover/navigation
- `safeRichText.js` — safe HTML → plain-text conversion
- `serviceTitle.js` — normalises service titles for display
- `smoothScroll.js` — offset-aware scroll helper

**Styles**: Global CSS in `src/styles/`. Component-specific styles are co-located `.css` files. Typography uses Montserrat throughout.

**Post-build SEO**: `scripts/generate-static-og-pages.mjs` generates static OG pages; `scripts/verify-static-seo.mjs` verifies them. Both run automatically after `npm run build`.

**Language**: The entire UI is in Ukrainian. Hardcoded fallback strings (e.g. alt text, empty states) should also be Ukrainian.
