/**
 * Thin wrapper around the TMDB HTTP API. Owns all knowledge of TMDB's
 * wire format and maps it into our internal models.
 */
import type { Movie, MovieDetail } from '../models/Movie'

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN

interface TmdbSearchResultRaw {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
  vote_count: number
}

interface TmdbSearchResponseRaw {
  page: number
  results: TmdbSearchResultRaw[]
  total_pages: number
  total_results: number
}

export interface TmdbVideoRaw {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

interface TmdbVideoResponseRaw {
  id: number
  results: TmdbVideoRaw[]
}

export class TmdbApiError extends Error {}

function assertApiToken(): void {
  if (!API_TOKEN) {
    throw new TmdbApiError(
      'Missing TMDB API token. Set VITE_TMDB_API_TOKEN in your .env.local file.',
    )
  }
}

function getHeaders() {
  return {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  }
}

function mapSearchResult(raw: TmdbSearchResultRaw): Movie {
  return {
    imdbID: `tmdb-${raw.id}`,
    title: raw.title,
    year: raw.release_date ? raw.release_date.split('-')[0] : 'N/A',
    poster: raw.poster_path
      ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
      : '',
    backdrop: raw.backdrop_path
      ? `https://image.tmdb.org/t/p/original${raw.backdrop_path}`
      : '',
    type: 'movie',
    tmdbId: raw.id,
    rating: raw.vote_average > 0 ? raw.vote_average.toFixed(1) : undefined,
  }
}

/** Search movies by free-text title using TMDB. */
export async function searchMoviesTmdb(
  query: string,
  page = 1,
): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
  assertApiToken()
  if (!query.trim()) return { movies: [], totalResults: 0, totalPages: 0 }

  const url = new URL(`${BASE_URL}/search/movie`)
  url.searchParams.set('query', query.trim())
  url.searchParams.set('include_adult', 'false')
  url.searchParams.set('language', 'en-US')
  url.searchParams.set('page', String(page))

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new TmdbApiError(`TMDB request failed with status ${response.status}`)
  }

  const data = (await response.json()) as TmdbSearchResponseRaw

  return {
    movies: (data.results ?? []).map(mapSearchResult),
    totalResults: data.total_results ?? 0,
    totalPages: data.total_pages ?? 0,
  }
}

/** Fetch videos (trailers, teasers) for a movie by TMDB ID. */
export async function getMovieVideos(tmdbId: number): Promise<TmdbVideoRaw[]> {
  assertApiToken()

  const url = new URL(`${BASE_URL}/movie/${tmdbId}/videos`)
  url.searchParams.set('language', 'en-US')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new TmdbApiError(`TMDB videos request failed with status ${response.status}`)
  }

  const data = (await response.json()) as TmdbVideoResponseRaw
  return data.results ?? []
}

/** Find the best YouTube trailer/teaser from video results. */
export function findBestTrailer(videos: TmdbVideoRaw[]): TmdbVideoRaw | null {
  return (
    videos.find(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser') && v.official,
    ) ??
    videos.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) ??
    videos.find((v) => v.site === 'YouTube') ??
    null
  )
}

/** Build YouTube embed URL with autoplay. */
export function buildYouTubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`
}

interface TmdbMovieDetailRaw {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  genres: { id: number; name: string }[]
  runtime: number | null
  imdb_id: string | null
  credits?: {
    crew: { known_for_department: string; job: string; name: string }[]
    cast: { name: string; profile_path: string | null }[]
  }
  release_dates?: {
    results: {
      iso_3166_1: string
      release_dates: { certification: string }[]
    }[]
  }
}

/** Pull the most common audience certification (e.g. "PG-13", "18+") from release dates. */
function extractAgeRating(data: TmdbMovieDetailRaw): string | undefined {
  const us = data.release_dates?.results.find((r) => r.iso_3166_1 === 'US')
  const certification = us?.release_dates?.find((d) => d.certification)?.certification
  return certification ? certification : undefined
}

/** Fetch full detail for a single title by TMDB ID (includes videos + credits). */
export async function getMovieDetailsTmdb(tmdbId: number): Promise<MovieDetail> {
  assertApiToken()

  const url = new URL(`${BASE_URL}/movie/${tmdbId}`)
  url.searchParams.set('language', 'en-US')
  url.searchParams.set('append_to_response', 'videos,credits,release_dates')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new TmdbApiError(`TMDB detail request failed with status ${response.status}`)
  }

  const data = (await response.json()) as TmdbMovieDetailRaw

  const director =
    data.credits?.crew.find((c) => c.known_for_department === 'Directing' && c.job === 'Director')?.name ?? ''
  const actors = (data.credits?.cast ?? []).slice(0, 5).map((c) => c.name).join(', ')
  const cast = (data.credits?.cast ?? [])
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined,
    }))

  return {
    imdbID: `tmdb-${data.id}`,
    title: data.title,
    year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : '',
    backdrop: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : '',
    type: 'movie',
    tmdbId: data.id,
    plot: data.overview,
    genre: data.genres.map((g) => g.name).join(', '),
    director,
    actors,
    runtime: data.runtime ? `${data.runtime} min` : 'N/A',
    imdbRating: data.vote_average.toFixed(1),
    ageRating: extractAgeRating(data),
    cast,
  }
}

type MovieListCategory = 'now_playing' | 'popular' | 'top_rated' | 'upcoming'

/** Fetch a paginated TMDB movie list (now playing, popular, top rated, upcoming). */
export async function getMovieList(
  category: MovieListCategory,
  page = 1,
): Promise<{ movies: Movie[]; totalResults: number; totalPages: number }> {
  assertApiToken()

  const url = new URL(`${BASE_URL}/movie/${category}`)
  url.searchParams.set('language', 'en-US')
  url.searchParams.set('page', String(page))

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new TmdbApiError(`TMDB ${category} request failed with status ${response.status}`)
  }

  const data = (await response.json()) as TmdbSearchResponseRaw

  return {
    movies: (data.results ?? []).map(mapSearchResult),
    totalResults: data.total_results ?? 0,
    totalPages: data.total_pages ?? 0,
  }
}
