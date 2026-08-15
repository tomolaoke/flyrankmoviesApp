import type { MovieDetail } from '../models/Movie'

/**
 * Data model for the home page's "Featured" editorial spotlight. Kept
 * separate from the visual components so the section can later be driven
 * by a CMS/API or support multiple featured items without UI changes.
 */
export interface FeaturedContent {
  title: string
  description: string
  date: string
  thumbnail: string
  duration: string
  currentTime: string
  /** TMDB id, when present, so the panel can hook up a real trailer. */
  videoId?: number
  ageRating?: string
  imdbRating?: string
  runtime?: string
  year?: string
  /** Comma-separated genres, matching the hero's GenreTags prop. */
  genre?: string
  cast?: { name: string; photo?: string }[]
}

const DEFAULT_DURATION = '9:21'
const DEFAULT_CURRENT_TIME = '0:51'

const FALLBACK_THUMBNAIL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23111827"/><stop offset="1" stop-color="%23374151"/></linearGradient></defs><rect width="1280" height="720" fill="url(%23g)"/><circle cx="640" cy="360" r="72" fill="black" fill-opacity="0.35"/><path d="M612 326v68l58-34z" fill="white" fill-opacity="0.85"/></svg>'

/** Fallback editorial content used while (or when) no movie data is available. */
export const FALLBACK_FEATURED_CONTENT: FeaturedContent = {
  title: 'IGN Interviews the Cast of The Last of Us HBO',
  description:
    "As I'm sure you're aware, HBO's adaptation of Naughty Dog's acclaimed video game series has proved to be a major hit. The good news is this means that season two—which will adapt Part II—is on the way.",
  date: '04 June, 2023',
  thumbnail: FALLBACK_THUMBNAIL,
  duration: DEFAULT_DURATION,
  currentTime: DEFAULT_CURRENT_TIME,
}

/**
 * Build the Featured spotlight from a loaded movie. When no movie is
 * available yet the fallback editorial content is returned so the section
 * always renders something sensible.
 */
export function buildFeaturedContent(movie: MovieDetail | null): FeaturedContent {
  if (!movie) {
    return FALLBACK_FEATURED_CONTENT
  }

  return {
    title: movie.title,
    description: movie.plot,
    date: movie.year,
    thumbnail: movie.backdrop || FALLBACK_THUMBNAIL,
    duration: DEFAULT_DURATION,
    currentTime: DEFAULT_CURRENT_TIME,
    videoId: movie.tmdbId,
    ageRating: movie.ageRating,
    imdbRating: movie.imdbRating,
    runtime: movie.runtime,
    year: movie.year,
    genre: movie.genre,
    cast: movie.cast,
  }
}
