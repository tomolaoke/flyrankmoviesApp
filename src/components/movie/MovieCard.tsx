import { Link } from 'react-router-dom'
import type { Movie } from '../../models/Movie'
import { useAuthContext } from '../../context/useAuthContext'
import { RatingBadge } from './RatingBadge'
import { Button } from '../common/Button'

interface MovieCardProps {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (movie: Movie) => void
  onWatchPreview?: (movie: Movie) => void
}

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="445" viewBox="0 0 300 445"><rect width="300" height="445" fill="%23374151"/><text x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="18">No Poster</text></svg>'

/**
 * Displays a single movie's poster, title, year, and rating. The poster
 * and title link to the full details page; the favorite toggle and
 * watch preview are sibling buttons (not nested inside the link).
 */
export function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
  onWatchPreview,
}: MovieCardProps) {
  const { user } = useAuthContext()
  const hasTmdbId = movie.tmdbId != null

  return (
    <li className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/movie/${movie.imdbID}`} className="flex flex-1 flex-col">
        <img
          src={movie.poster || FALLBACK_POSTER}
          alt={`Poster for ${movie.title}`}
          className="aspect-[2/3] w-full object-cover"
          loading="lazy"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 dark:text-white">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{movie.year}</span>
            <RatingBadge movie={movie} />
          </div>
        </div>
      </Link>
      <div className="space-y-2 px-4 pb-4">
        {user && (
          <button
            type="button"
            onClick={() => onToggleFavorite(movie)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
            className={`w-full rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              isFavorite
                ? 'border-red-600 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-600/20 dark:text-red-300 dark:hover:bg-red-600/30'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {isFavorite ? '♥ Favorited' : '♡ Add to favorites'}
          </button>
        )}
        {hasTmdbId && onWatchPreview && (
          <Button
            variant="danger"
            onClick={() => onWatchPreview(movie)}
            className="w-full py-2"
            aria-label={`Watch preview for ${movie.title}`}
          >
            ▶ Watch Preview
          </Button>
        )}
      </div>
    </li>
  )
}