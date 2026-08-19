# 📔 EngineerDairy

_A day-by-day engineering journal for FlyRank AI Movies (React + TypeScript + Vite)._

Each entry follows the same structure: **Objective → Engineering Decision →
Design Decision → Implementation → Problem → Investigation → Discovery →
Solution → Lesson**, so it doubles as a decision log and a debugging record.

---

## Day 1 — Featured spotlight & User Reviews sections

**Objective:** Give the home page premium, editorial content blocks — a
large Featured spotlight below "Popular right now" and a dark, branded User
Reviews section above the footer — to make the landing page feel cinematic
and complete.

**Engineering Decision:** Ship both sections as pure presentational
components fed by static data first (`constants/featuredContent.ts`,
`constants/reviews.ts`), with a clear seam so real APIs can replace the data
later without touching the UI. This matches the existing MVVM split: views
never fetch, viewmodels orchestrate, services own wire formats.

**Design Decision:** Featured = a wide 16:9 video player (≈70%) paired with a
compact dark info panel (≈30%) — title, age rating, plot, cast, IMDb/runtime/
year, genre pills — plus a translucent play button, interactive seek bar, and
fullscreen. Reviews = a 2×2 desktop grid (1 col on mobile) of minimal cards
with a title, line-clamped body, and a footer (circular initials avatar,
username, Read More), alternating charcoal/near-black surfaces to avoid
repetitive-looking rows.

**Implementation:** Created `src/components/featured/` (10 files), the
FeaturedSection, `src/components/reviews/` (13 files) with ReviewCard/
ReviewsGrid/ReviewsHeader/ReviewFooter/Reviewer/Avatar/Username/ReadMore/
SectionTitle/SeeMoreLink, plus the two data constants. Wired both into
HomePage, kept all styling Tailwind `dark:`-friendly, added accessible labels.
Committed as `6e64e78`.

**Problem:** Sample review data was hard-coded with no way to evolve it, and
the section designs had to stay visually consistent with an existing dark
theme.

**Investigation:** Reviewed the existing component/theme conventions (border
`white/10`, `rounded-lg`, brand purple) and the Movie/MovieDetail models to
reuse types.

**Discovery:** The static-data-first approach left a clean contract: the
`Review` model (id/title/content/author/avatar) and the `FeaturedContent`
builder that the UI renders — swap the source, keep the contract.

**Solution:** Kept the contract, committed the sections, and noted the
review/featured sources as the next thing to make dynamic.

**Lesson:** A clean data contract + presentational components makes a
later API integration a drop-in, not a rewrite.

---

## Day 2 — 8-hour hero/Featured rotation

**Objective:** Make the hero backdrop and Featured spotlight advance to a new
curated movie over time, so the page feels alive and rotating rather than
static.

**Engineering Decision:** Time-slot based rotation. Define
`FEATURED_ROTATION_MS = 8h` and derive `slotIndex = floor(now / 8h)`; the
spotlight uses `movies[slotIndex % count]` and `featured` uses the next slot.
No timers or user interaction needed to cycle.

**Design Decision:** A page left open across a slot boundary should advance
automatically, so a `useEffect` schedules a `setTimeout` for the next
boundary to nudge `slotIndex` (which then re-renders and re-syncs the timer).

**Implementation:** Updated `useFeaturedMoviesViewModel` to expose
`spotlight` and `featured`, wired `spotlight` into `MovieHero` and
`featured` into `FeaturedSection`, documented the behavior in the README.
Committed as `eae2805`.

**Problem:** Naive `slotIndex` state would go stale if the tab stayed open
for hours.

**Investigation:** Confirmed the hero used `movies[0]` and the Featured
section used `featuredContent` built from a single fixed title.

**Discovery:** Date-derived state (an epoch slot) recomputes consistently on
any render, and a boundary timer is only needed to *force* a re-render at the
rotation edge.

**Solution:** Epoch-slot derivation + a scheduled boundary timer, cleaned up
on unmount/re-slot.

**Lesson:** Prefer deriving state from the clock over storing "current
selection" when a value must change with time — fewer bugs, trivially
testable.

---

## Day 3 — TMDB health check, live User Reviews, and unit tests

**Objective:** (1) Add a **TMDB health check** to `/health` (env vars +
live connectivity, mirroring the OMDb check). (2) Make **User Reviews
dynamic**: real TMDB reviews for the currently-featured movie, plus the
signed-in user's Firestore reviews shown alongside and highlighted. (3) Add
**unit tests** confirming the TMDB integration (healthService +
useMovieListViewModel). (4) Update all `.md` docs. **No git push.**

**Engineering Decision (env var):** The project already reads the TMDB token
as `VITE_TMDB_API_TOKEN` (in `tmdbService.ts` and `.env.example`), so the
health check validates that name — not the `VITE_TMDB_API_KEY` spelled in the
request. Confirmed with the user before coding.

**Engineering Decision (review source):** Fetch reviews for the **current
Featured movie** (`featured.tmdbId`), so the section always matches the
spotlighted title. Confirmed with the user.

**Design Decision:** Keep the existing `Review` contract; extend it with
optional `source` (`'tmdb' | 'firestore'`), `rating`, and `createdAt`.
Map TMDB's wire format in `tmdbService.getMovieReviews()` (deriving a short
headline from the review body, normalizing avatar paths, mapping ratings).
Fall back to the curated sample reviews while the featured movie is loading
or if TMDB returns none, so the section is never empty. Cap TMDB cards at 6;
Firestore reviews are appended and badge-marked.

**Implementation:**
- `healthService.ts`: exported `REQUIRED_ENV_VARS` now includes
  `VITE_TMDB_API_TOKEN` + `VITE_TMDB_BASE_URL`; added
  `TmdbHealthResult` and `checkTmdbConnection()` (live `searchMoviesTmdb('barbie')`,
  5 sample posters). Wired into `useHealthCheckViewModel` and a new **TMDB API**
  section in `HealthCheckPage`.
- `tmdbService.ts`: added `getMovieReviews(tmdbId)` with avatar/title mapping.
- `firestoreService.ts`: added `subscribeToUserReviews(uid, onChange)` reading
  `users/{uid}/reviews` (read-only; covered by existing user-scoped rules).
- `viewmodels/useUserReviewsViewModel.ts`: fetches TMDB reviews for
  `featured?.tmdbId`, subscribes to Firestore when signed in, merges both.
- Components: `UserReviews` now takes a `reviews` prop; `HomePage` feeds it
  from the new viewmodel; `ReviewCard` shows a small brand-tinted **Firestore**
  badge on user-owned reviews.
- Tests: `healthService.test.ts` (5) and `useMovieListViewModel.test.ts` (3)
  added — **16 tests passing** across 3 suites.

**Problem:** `import.meta.env` is a Vite construct — Jest's CommonJS transform
rejects `import.meta` with `SyntaxError: Cannot use 'import.meta' outside a
module`, which surfaced the moment a test tried to load the real
`healthService`.

**Investigation:** The existing `SettingsForm.test.tsx` passed only because it
never loads a service that touches `import.meta`. Trying to `jest.requireActual`
the service failed at the transformed `import.meta.env[name]` line. Also hit a
duplicate-import slip in `tmdbService.ts` and an ESLint `set-state-in-effect`
error for clearing reviews synchronously in an effect.

**Discovery:** Isolating env reads in one tiny module (`src/config/env.ts`,
`getEnv(name)`) that tests can `jest.mock` keeps every service/viewmodel
loadable under Jest without babel changes.

**Solution:** Created `config/env.ts`; `healthService` reads env via `getEnv`
(mocked in tests with `../config/env`). Derive `firestoreReviews` from a
uid-keyed state object instead of clearing it synchronously in an effect
(clean under `react-hooks/set-state-in-effect`). Removed the duplicate import.

**Verification:** `npm test` (16/16), `npm run lint` (0 errors; 5 pre-existing
warnings in untouched files), `npm run build` (tsc + vite clean), dev server
serves every changed module with HTTP 200, and a real TMDB call using
`.env.local`'s token returned `search 200 / 20 results` and
`reviews 200 / 18 results` — confirming the integration end-to-end.

**Lesson:** Design for testability from the start — a one-line env indirection
beat fighting the toolchain. When a requirement spells an env var differently
than the code already uses (`_API_KEY` vs `_API_TOKEN`), resolve the mismatch
with the user instead of silently "fixing" or blindly following it.