# 🎬 FlyRank AI Movies

_Designed with Claude Code & Deepseek by Tomola Oke, Frontend AI Engineering Intern at FlyRankAI_

![Hero](src/assets/hero.png)

A modern, **cinematic** movie discovery app built with **React + TypeScript**
using an **MVVM architecture**. Search movies across **TMDB** and **OMDb**,
watch official trailers and short previews, save personal favorites, switch
between **dark and light themes**, and explore curated grids like Popular,
Now Playing, and Top Rated.

## ✨ Features

### 🎬 Cinematic Hero
A Netflix-style, full-width hero section: layered backdrop image with dark
cinematic overlays, a floating circular **play button**, large uppercase
title, age-rating badge, cast avatars, IMDb/runtime/year metadata, and genre
pills — all **data-driven** from the featured movie. The header floats
transparently over it on the home page.

### 🔍 Movie search (TMDB + OMDb)
- **TMDB search** as the primary source — richer results with official
  trailer videos, ratings, and genre data.
- OMDb-backed fallback for legacy IDs.
- Search bar lives **inside the hero** for a clean, immersive layout.

### ▶ Watch Preview (trailers)
The **VideoModal** fetches the movie's YouTube trailer from TMDB and plays it
in an embedded iframe (autoplay) — reachable from movie cards, the details
page, and the hero play button.

### 🎞 Curated & paginated grids
| Grid | Cards per page | Pagination up to |
| ------- | -------------- | ----------------- |
| Popular right now | 12 | 20 pages |
| Now Playing | 8 | 5 pages |
| Top Rated | 8 | 40 pages |

Powered by a reusable paginated list viewmodel (`useMovieListViewModel`).

### 🌗 Dark / light theme
A persistent theme toggle (defaults to **dark**) stored in `localStorage`,
toggling a `.dark` class on `<html>`. Every component ships light + dark
styles via Tailwind `dark:` variants.

### 🔐 Authentication & favorites
- Email/password and **Google sign-in** via Firebase Authentication.
- Favorites synced in real time to **Firestore** (`users/{uid}/favorites/{id}`).
- Protected routes redirect guests to `/login` and return them afterward.

### ⚙️ Settings
Update email, password, and notification preferences through a
`react-hook-form` + `zod` validated form.

### 🩺 Health check
`/health` (the red **Status** pill in the header) verifies env vars, runs a
live API fetch, probes Firestore, and shows Firebase Auth state — perfect for
diagnosing setup issues.

### 📱 Responsive & accessible
Hamburger navigation on mobile, adaptive grid columns, `aria` labels,
keyboard-accessible controls, and focus rings.

## 🛠 Tech stack

| Concern | Library |
| --------- | --------- |
| UI | React 19 + TypeScript |
| Build tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Movie data | TMDB API + OMDb API |
| Trailers | TMDB videos → YouTube embed |
| Auth & data | Firebase Authentication + Firestore |
| Forms & validation | react-hook-form + zod |
| Theme | Tailwind `darkMode: 'class'` + React Context |

## 🏗 Architecture (MVVM)

```
src/
├── models/            # Model: plain TypeScript domain types
│   ├── Movie.ts        (Movie, MovieDetail, FavoriteMovie)
│   ├── User.ts
│   └── Settings.ts
├── services/          # Model: talks to external systems
│   ├── tmdbService.ts       # TMDB search, lists, details, videos, trailers
│   ├── omdbService.ts       # OMDb fallback
│   ├── authService.ts
│   ├── firestoreService.ts
│   └── healthService.ts     # connectivity checks for /health
├── constants/         # static config (curated movie IDs)
├── viewmodels/        # ViewModel: state hooks orchestrating services
│   ├── useSearchMoviesViewModel.ts
│   ├── useMovieListViewModel.ts    # paginated Popular/Now Playing/Top Rated
│   ├── useFeaturedMoviesViewModel.ts
│   ├── useMovieDetailViewModel.ts  # routes tmdb-* vs tt* IDs
│   ├── useMovieRating.ts
│   ├── useAuthViewModel.ts
│   ├── useFavoritesViewModel.ts
│   ├── useSettingsViewModel.ts
│   └── useHealthCheckViewModel.ts
├── context/           # cross-cutting app state
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx           # dark/light theme
│   ├── ThemeContextInstance.ts
│   └── useThemeContext.ts
├── components/        # View: presentational UI
│   ├── common/          (Button, Input, StatusButton, Pagination, …)
│   ├── layout/          (Navbar overlay variant, Footer, Layout)
│   ├── hero/            (MovieHero, HeroBackground, HeroContent, PlayButton, CastList, MovieMetadata, GenreTags)
│   ├── movie/           (SearchBar hero/default variant, MovieList, MovieCard, RatingBadge, VideoModal)
│   └── settings/        (SettingsForm)
├── pages/              # View: route screens
│   ├── HomePage.tsx, MovieDetailsPage.tsx, HealthCheckPage.tsx,
│   ├── LoginPage.tsx, SignupPage.tsx, FavoritesPage.tsx, SettingsPage.tsx
├── routes/             # AppRouter.tsx, ProtectedRoute.tsx
├── schemas/            # zod validation schemas
└── config/             # firebase.ts initialization
```

**Why MVVM:** Views never call `fetch` or the Firebase SDK — they read state
and call functions from a `viewmodels/*` hook. ViewModels never touch the DOM —
they orchestrate `services/*` and `models/*`. This keeps components
presentational and all business logic in unit-testable hooks and services.

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

```ini
# TMDB — get a Read Access Token at https://www.themoviedb.org/settings/api
VITE_TMDB_API_TOKEN=your_tmdb_api_token_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

# OMDb — get a key at https://www.omdbapi.com/apikey.aspx
VITE_OMDB_API_KEY=your_omdb_api_key_here
VITE_OMDB_BASE_URL=https://www.omdbapi.com/

# Firebase — Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Important:
<<<<<<< HEAD
- This file **must live in the same folder as `package.json`** (the Vite
  project root). Vite silently ignores env files placed anywhere else.
- `VITE_OMDB_BASE_URL` has no built-in default or every OMDb call throws an `Invalid URL`
  error. `/health` (see Features above) will flag this immediately.
- Your OMDb key must be **activated** — after requesting one at the link
  above, OMDb emails you an activation link; the key returns
  `401 Invalid API key!` until you click it.
- `.env.local` is git-ignored — never commit real API keys.
=======
- The file **must live beside `package.json`** — Vite silently ignores env
  files anywhere else, and only reads them at server startup (restart the dev
  server after editing).
- `.env.local` is **git-ignored** — never commit real keys/tokens.
- Set the same variables in your **Netlify** dashboard (Site settings →
  Environment variables) for production builds.
>>>>>>> d23c96b (Integrate TMDB API, add cinematic hero, theme toggle, trailers, and layout updates)

### 3. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
3. **Firestore Database** → create a database and apply user-scoped rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /favorites/{movieId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```
4. Register a **Web app** and copy its config into `.env.local` (use the
   `appId`, not the Analytics `measurementId`).

### 4. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
npm run preview
```

## 📜 Scripts

| Command | Description |
| --------- | ----------- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest suite once |
| `npm run test:watch` | Run Jest in watch mode |

## 🔒 Security notes

- All API keys/tokens are read from `import.meta.env.*` — never hardcoded.
- `.env.local` is excluded via `.gitignore`; only `.env.example` (with
  placeholders) is committed.
- Safe to push to GitHub; real secrets live in Netlify's environment
  variables.

## ❓ Troubleshooting

Start at **`/health`** (red **Status** pill in the header) — it checks env
vars, does a live fetch, and probes Firestore/Auth in one place.

- **Blank page on load** — `.env.local` missing or in the wrong folder (see
  step 2).
- **"Something went wrong" on login/signup** — the real Firebase error is
  logged to the browser console (`console.error('Firebase auth error:', ...)`
  in `authService.ts`); check the sign-in method is enabled and the domain is
  authorized.
- **OMDb/TMDB 401** — the key/token isn't activated or isn't set.

## 📝 Notes & known limitations

- TMDB search results include a rating, so `RatingBadge` uses it directly and
  only falls back to one OMDb detail request for OMDb-backed titles (not
  batched/cached — fine for free tiers).
- "Popular right now" is a live TMDB feed paginated client-side (12/page, up
  to 20 pages); Now Playing and Top Rated are 8/page.
- Firestore security relies entirely on the rules above — there's no backend
  re-checking ownership.
