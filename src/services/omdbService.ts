/**
 * Thin wrapper around the OMDb HTTP API. Owns all knowledge of OMDb's
 * wire format (PascalCase fields, "N/A" sentinels, string "True"/"False"
 * flags) and maps it into our internal `Movie`/`MovieDetail` models so
 * the rest of the app never has to think about OMDb's quirks.
 */
import type { Movie, MovieDetail } from '../models/Movie'

const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com/'
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

interface OmdbSearchResultRaw {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface OmdbSearchResponseRaw {
  Search?: OmdbSearchResultRaw[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

interface OmdbMovieDetailRaw extends OmdbSearchResultRaw {
  Plot: string
  Genre: string
  Director: string
  Actors: string
  Runtime: string
  imdbRating: string
  Response: 'True' | 'False'
  Error?: string
}

export class OmdbApiError extends Error {}

function mapSearchResult(raw: OmdbSearchResultRaw): Movie {
  return {
    imdbID: raw.imdbID,
    title: raw.Title,
    year: raw.Year,
    poster: raw.Poster !== 'N/A' ? raw.Poster : '',
    type: raw.Type,
  }
}

function assertApiKey(): void {
  if (!API_KEY) {
    throw new OmdbApiError(
      'Missing OMDb API key. Set VITE_OMDB_API_KEY in your .env.local file.',
    )
  }
}

/** Search movies by free-text title. Returns an empty array on "not found". */
export async function searchMovies(query: string, page = 1): Promise<{ movies: Movie[]; totalResults: number }> {
  assertApiKey()
  if (!query.trim()) return { movies: [], totalResults: 0 }

  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', API_KEY)
  url.searchParams.set('s', query.trim())
  url.searchParams.set('type', 'movie')
  url.searchParams.set('page', String(page))

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed with status ${response.status}`)
  }

  const data = (await response.json()) as OmdbSearchResponseRaw
  if (data.Response === 'False') {
    // OMDb reports "no results" as an error payload rather than an empty array.
    if (data.Error === 'Movie not found!') return { movies: [], totalResults: 0 }
    throw new OmdbApiError(data.Error || 'Unknown OMDb error')
  }

  return {
    movies: (data.Search ?? []).map(mapSearchResult),
    totalResults: Number(data.totalResults ?? 0),
  }
}

/** Fetch full detail for a single title by IMDb ID. */
export async function getMovieById(imdbID: string): Promise<MovieDetail> {
  assertApiKey()

  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', API_KEY)
  url.searchParams.set('i', imdbID)
  url.searchParams.set('plot', 'short')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed with status ${response.status}`)
  }

  const data = (await response.json()) as OmdbMovieDetailRaw
  if (data.Response === 'False') {
    throw new OmdbApiError(data.Error || 'Unknown OMDb error')
  }

  return {
    ...mapSearchResult(data),
    plot: data.Plot,
    genre: data.Genre,
    director: data.Director,
    actors: data.Actors,
    runtime: data.Runtime,
    imdbRating: data.imdbRating,
  }
}
