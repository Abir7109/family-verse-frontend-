# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands (PowerShell)

### Install dependencies
- `npm install`
- Clean install from lockfile: `npm ci`

### Run the app (dev)
- Start dev server (http://localhost:3000): `npm run dev`

### Lint
- Run ESLint: `npm run lint`
- Lint a single file: `npx eslint src/app/page.tsx`

### Typecheck
- TypeScript typecheck (no script defined): `npx tsc --noEmit`

### Production build
- Build: `npm run build`
- Run production server: `npm start`

### Tests
- No test runner/scripts are currently configured in `package.json`.

## High-level architecture

### What this repo is
- Next.js (App Router) + TypeScript project.
- Styling is Tailwind CSS v4 (via `@import "tailwindcss";` in `src/app/globals.css`) plus custom “luxury” CSS variables + utility classes.
- Animations use Framer Motion.

### Routing / entry points (Next.js App Router)
- Global HTML shell is defined in `src/app/layout.tsx`:
  - Loads Google fonts (Inter + Playfair Display) and exposes them via CSS variables.
  - Wraps the app with `src/components/theme-provider.tsx` (next-themes) so light/dark is controlled via a `.dark` class on the root.
  - Imports global styles from `src/app/globals.css`.
- Home page is `src/app/page.tsx` (composes sections under `src/components/home/*`).
- Feature routes are page-only (no route handlers/server code currently):
  - `src/app/tree/page.tsx` → `src/components/tree/family-tree.tsx`
  - `src/app/wall/page.tsx` → `src/components/wall/memorial-wall.tsx`
  - `src/app/birthdays/page.tsx` → `src/components/birthdays/birthday-center.tsx`

### Data model (static, in-repo)
- `src/data/family.ts` is the “source of truth” for the family graph:
  - `familyData.members`: list of `FamilyMember` objects (id/name/role/work/DOB/photoSrc).
  - `familyData.relationships`: `spouse` + `parent` edges referencing member ids.
- Photos referenced by `photoSrc` live under `public/` (e.g. `public/images/family/*`).
- Typical update flow when adding/changing a member:
  - Add/update the entry in `familyData.members`.
  - Add/update any edges in `familyData.relationships` that reference that member id.
  - Add the portrait image under `public/` and point `photoSrc` at it.

### Shared logic
- Birthday/date utilities are in `src/lib/birthday.ts` (age, “is birthday today”, days-until).
- `src/lib/use-mounted.ts` is used in client components to avoid SSR/CSR hydration mismatch by gating browser-only logic.

### UI / component structure
- `src/components/navbar.tsx` is the global nav and theme toggle (uses next-themes + `useMounted`).
- `src/components/ui/modal.tsx` is a reusable modal (Escape to close, click-backdrop to close) and is used by Tree and Birthdays.
- Route-specific UI lives in:
  - `src/components/tree/*`
  - `src/components/birthdays/*`
  - `src/components/wall/*`
  - `src/components/home/*` (home page sections)

### Client-side persistence (localStorage)
Several features are intentionally client-only and persist data in `localStorage`:
- Birthday popup “shown today” flag: `birthday_popup_shown_YYYY-MM-DD` (`src/components/birthday-auto-popup.tsx`).
- Birthday wishes (per member): `familyverse_birthday_wishes_v1_<memberId>` (`src/components/birthdays/birthday-center.tsx`).
- Memorial wall entries: `familyverse_memorial_wall_v1` (`src/components/wall/memorial-wall.tsx`).

### Project conventions / config worth knowing
- TS path alias: `@/*` maps to `src/*` (see `tsconfig.json`).
- ESLint is configured via `eslint.config.mjs` using `eslint-config-next` presets.
- Next config enables React Compiler: `reactCompiler: true` in `next.config.ts`.