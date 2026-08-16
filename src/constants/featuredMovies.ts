/**
 * TMDB popular movie IDs for the landing page's default grid and the
 * rotating hero/Featured spotlight.
 *
 * The grid is fetched by TMDB ID via `getMovieDetails` and paginated
 * client-side (see `useFeaturedMoviesViewModel`). The same list powers the
 * hero backdrop and Featured section, which advance to the next title every
 * 8 hours (see `FEATURED_ROTATION_MS` in `useFeaturedMoviesViewModel`).
 */
export const FEATURED_TMDB_IDS = [
  // Recent releases
  693134, // Dune: Part Two (2024)
  533535, // Deadpool & Wolverine (2024)
  1022789, // Inside Out 2 (2024)
  872585, // Oppenheimer (2023)
  346698, // Barbie (2023)
  447277, // Killers of the Flower Moon (2023)
  559969, // Everything Everywhere All at Once (2022)
  414906, // The Batman (2022)
  361743, // Top Gun: Maverick (2022)
  634649, // Spider-Man: No Way Home (2021)
  // Acclaimed classics
  299536, // Avengers: Endgame (2019)
  155, // The Dark Knight (2008)
  27205, // Inception (2010)
  157336, // Interstellar (2014)
  603, // The Matrix (1999)
  550, // Fight Club (1999)
  680, // Pulp Fiction (1994)
  278, // The Shawshank Redemption (1994)
  13, // Forrest Gump (1994)
  238, // The Godfather (1972)
]