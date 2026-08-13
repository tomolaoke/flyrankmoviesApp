# FlyRank AI Movies

_Designed with Claude Code by Tomola Oke, Frontend AI Engineering Intern at FlyRankAI_

A React + TypeScript movie search application built with an **MVVM
architecture**. Search movies via the OMDb API, sign up / log in with
Firebase Authentication (email/password or Google), save personal favorites
to Firestore, and manage account settings through an accessible, validated
form.

## Tech stack

| Concern            | Library                                   |
| ------------------- | ------------------------------------------ |
| UI                  | React 19 + TypeScript                      |
| Build tool          | Vite                                       |
| Routing             | React Router v7                            |
| Styling             | Tailwind CSS                               |
| Auth & data         | Firebase Authentication + Firestore        |
| Movie data          | OMDb API                                   |
| Forms & validation  | react-hook-form + zod                      |
| Testing             | Jest + React Testing Library               |

## Architecture (MVVM)

```
src/
├── models/          # Model: plain TypeScript types describing domain data
│   ├── Movie.ts
│   ├── User.ts
│   └── Settings.ts
├── services/         # Model: talks to external systems (OMDb, Firebase)
│   ├── omdbService.ts
│   ├── authService.ts
│   ├── firestoreService.ts
│   └── healthService.ts   # OMDb/Firestore/env connectivity checks for /health
├── constants/          # Static config, e.g. curated landing-page movie IDs
│   └── featuredMovies.ts
├── viewmodels/        # ViewModel: hooks that hold UI state and call services
│   ├── useSearchMoviesViewModel.ts
│   ├── useFeaturedMoviesViewModel.ts
│   ├── useMovieDetailViewModel.ts
│   ├── useAuthViewModel.ts
│   ├── useFavoritesViewModel.ts
│   ├── useSettingsViewModel.ts
│   ├── useHealthCheckViewModel.ts
│   └── useMovieRating.ts
├── context/           # Cross-cutting app state
│   ├── AuthContext.tsx
│   ├── AuthContextInstance.ts
│   └── useAuthContext.ts
├── components/        # View: reusable, presentational UI pieces
│   ├── common/         (Button, Input, Checkbox, Spinner, ErrorMessage, GoogleSignInButton, Pagination, StatusBadge)
│   ├── layout/          (Navbar, Layout)
│   ├── movie/           (SearchBar, MovieList, MovieCard, RatingBadge)
│   └── settings/        (SettingsForm)
├── pages/              # View: route-level screens composing the above
│   ├── HomePage.tsx
│   ├── MovieDetailsPage.tsx
│   ├── HealthCheckPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── FavoritesPage.tsx
│   └── SettingsPage.tsx
├── routes/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx
├── schemas/            # zod validation schemas shared by forms + types
│   ├── authSchema.ts
│   └── settingsSchema.ts
└── config/
    └── firebase.ts      # Firebase SDK initialization
```

**Why MVVM here:** Pages/components (**View**) never call `fetch` or the
Firebase SDK directly — they only read state and call functions exposed by a
`viewmodels/*` hook (**ViewModel**). ViewModels never touch the DOM — they
only orchestrate `services/*` and `models/*` (**Model**). This keeps
components simple/presentational and keeps all business logic in
unit-testable hooks and services.

## Features

- 🔍 **Search** — Search movies by title via the OMDb API; results show poster,
  title, release year, and IMDb rating.
- 🎞️ **Landing page grid** — Before searching, the home page shows a curated,
  **paginated** "Popular right now" grid (OMDb has no trending/discover
  endpoint, so this is a fixed list of 20 well-known titles fetched by IMDb
  ID, 10 per page, with prev/next arrow pagination — see
  `constants/featuredMovies.ts` and `components/common/Pagination.tsx`).
- 🎬 **Movie details** — Clicking any poster/title (search results, featured
  grid, or favorites) opens `/movie/:imdbID` with full plot, genre, director,
  cast, runtime, and rating (`MovieDetailsPage`).
- 🔐 **Auth** — Email/password sign up and login, plus **Google sign-in**, via
  Firebase Authentication.
- ❤️ **Favorites** — Signed-in users can save/remove favorite movies, synced
  in real time to Firestore (`users/{uid}/favorites/{imdbID}`), from the
  search grid, featured grid, or the details page.
- 🔒 **Protected routes** — `/favorites` and `/settings` redirect
  unauthenticated visitors to `/login` (and return them afterward).
- ⚙️ **Settings** — Update email, password, and notification preference via
  a `react-hook-form` + `zod` validated form.
- 📱 **Mobile responsive** — Grid columns, poster aspect ratio, and form
  layout adapt down to phone widths; the nav bar collapses into a hamburger
  menu below the `sm` breakpoint.
- ♿ **Accessibility** — Labeled inputs, `aria-invalid`/`aria-describedby`
  wiring, `role="alert"` error messages, visible focus rings, and validation
  errors that only appear after a field is touched or the form is submitted.
- 🩺 **Health check** — `/health` (linked as "Status" next to the footer
  credit line) verifies required env vars are set, runs a live OMDb search
  and renders the actual fetched results, probes Firestore connectivity, and
  shows the current Firebase Auth state. Useful for diagnosing setup issues
  without digging through devtools.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in real values:

```bash
cp .env.example .env.local
```

```ini
VITE_OMDB_API_KEY=your_omdb_api_key_here
VITE_OMDB_BASE_URL=

# Firebase — from Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Important:
- This file **must live in the same folder as `package.json`** (the Vite
  project root). Vite silently ignores env files placed anywhere else.
- `VITE_OMDB_BASE_URL` has no built-in default — it must be set (to
  `https://www.omdbapi.com/`) or every OMDb call throws an `Invalid URL`
  error. `/health` (see Features above) will flag this immediately.
- Your OMDb key must be **activated** — after requesting one at the link
  above, OMDb emails you an activation link; the key returns
  `401 Invalid API key!` until you click it.
- `.env.local` is git-ignored — never commit real API keys.

### 3. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → enable **Email/Password** and
   **Google**.
   - For Google sign-in, `localhost` is authorized by default in new
     projects; if you deploy elsewhere, add that domain under
     Authentication → Settings → **Authorized domains**.
3. **Firestore Database** → create a database (start in production mode) and
   apply these security rules so users can only read/write their own data:

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

4. Register a **Web app** under Project Settings and copy its config values
   into `.env.local`. Use the `appId` field specifically (format
   `1:<sender-id>:web:<hash>`) — not the Google Analytics `measurementId`
   (format `G-XXXXXXX`), which is a different value.

### 4. Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Restart the dev server any time you
change `.env.local` — Vite only reads env files at startup.

### 5. Run tests

```bash
npm test          # single run
npm run test:watch  # watch mode
```

### 6. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Scripts

| Command              | Description                          |
| --------------------- | ------------------------------------- |
| `npm run dev`         | Start the Vite dev server             |
| `npm run build`       | Type-check and build for production   |
| `npm run preview`     | Preview the production build          |
| `npm run lint`        | Run ESLint                            |
| `npm test`            | Run the Jest test suite once          |
| `npm run test:watch`  | Run Jest in watch mode                |

## Troubleshooting

Start at **`/health`** ("Status" link in the footer) — it checks env var
presence, does a live OMDb fetch, and probes Firestore/Auth in one place,
which usually pinpoints these faster than the steps below.

- **Blank page on load** — usually means Firebase `initializeApp()` threw
  because `.env.local` is missing or in the wrong folder. Check the browser
  console for the error and confirm the env file location (see step 2 above).
- **"Something went wrong" on login/signup** — the UI intentionally shows a
  generic message, but the real Firebase error code is always logged to the
  browser console via `console.error('Firebase auth error:', ...)` in
  `authService.ts`. Check there first; common causes are the sign-in method
  not being enabled yet, or an unauthorized domain for Google sign-in.
- **OMDb search returns 401** — the API key hasn't been activated yet (see
  step 2 above).

## Notes & known limitations

- OMDb's search endpoint doesn't return IMDb ratings, so `RatingBadge` makes
  one additional detail request per visible card (`useMovieRating`). This is
  fine for OMDb's free tier but isn't batched/cached — a production build
  would want to debounce or cache these.
- The landing page's "Popular right now" grid is a static, curated, paginated
  list, not a live trending feed — OMDb doesn't expose one.
- Firestore security relies entirely on the rules above; there is no backend
  API in this project re-checking ownership.
