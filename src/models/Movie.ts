/**
 * Domain models for movie data, decoupled from the exact shape OMDb/TMDB
 * returns over the wire (see `OmdbSearchResultRaw`/`OmdbMovieDetailRaw`
 * in `services/omdbService.ts` and `TmdbSearchResultRaw` in `services/tmdbService.ts`,
 * which get mapped into these).
 */

export interface Movie {
  imdbID: string
  title: string
  year: string
  poster: string
  type: string
  tmdbId?: number
  rating?: string
  backdrop?: string
}

export interface MovieDetail extends Movie {
  plot: string
  genre: string
  director: string
  actors: string
  runtime: string
  imdbRating: string
  ageRating?: string
  cast?: { name: string; photo?: string }[]
}

export interface FavoriteMovie extends Movie {
  addedAt: number
}
