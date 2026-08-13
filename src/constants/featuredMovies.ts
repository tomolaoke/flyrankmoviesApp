/**
 * OMDb has no "trending"/"popular" endpoint (it's search-only), so the
 * landing page's default grid is a curated list of well-known titles,
 * fetched by IMDb ID via `getMovieById` and paginated client-side
 * (see `useFeaturedMoviesViewModel`).
 */
export const FEATURED_IMDB_IDS = [
  // Recent releases
  'tt15239678', // Dune: Part Two (2024)
  'tt6263850', // Deadpool & Wolverine (2024)
  'tt22022452', // Inside Out 2 (2024)
  'tt15398776', // Oppenheimer (2023)
  'tt1517268', // Barbie (2023)
  'tt5537002', // Killers of the Flower Moon (2023)
  'tt6710474', // Everything Everywhere All at Once (2022)
  'tt1877830', // The Batman (2022)
  'tt1745960', // Top Gun: Maverick (2022)
  'tt10872600', // Spider-Man: No Way Home (2021)
  // Acclaimed classics
  'tt4154796', // Avengers: Endgame (2019)
  'tt0468569', // The Dark Knight (2008)
  'tt1375666', // Inception (2010)
  'tt0816692', // Interstellar (2014)
  'tt0133093', // The Matrix (1999)
  'tt0137523', // Fight Club (1999)
  'tt0110912', // Pulp Fiction (1994)
  'tt0111161', // The Shawshank Redemption (1994)
  'tt0109830', // Forrest Gump (1994)
  'tt0068646', // The Godfather (1972)
]
