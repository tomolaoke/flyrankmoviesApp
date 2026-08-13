import { Link } from 'react-router-dom'
import type { Movie } from '../../models/Movie'
import { useAuthContext } from '../../context/useAuthContext'
import { RatingBadge } from './RatingBadge'

interface MovieCardProps {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (movie: Movie) => void
}

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="445" viewBox="0 0 300 445"><rect width="300" height="445" fill="%23e5e7eb"/><text x="50%25" y="50%25" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="18">No Poster</text></svg>'

/**
 * Displays a single movie's poster, title, year, and rating. The poster
 * and title link to the full details page; the favorite toggle is a
 * sibling button (not nested inside the link, to keep the markup valid).
 */
export function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  const { user } = useAuthContext()

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Link to={`/movie/${movie.imdbID}`} className="flex flex-1 flex-col">
        <img
          src={movie.poster || FALLBACK_POSTER}
          alt={`Poster for ${movie.title}`}
          className="aspect-[2/3] w-full object-cover"
          loading="lazy"
        />
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="text-sm font-semibold text-gray-900">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{movie.year}</span>
            <RatingBadge imdbID={movie.imdbID} />
          </div>
        </div>
      </Link>
      {user && (
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => onToggleFavorite(movie)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
            className={`w-full rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              isFavorite
                ? 'border-brand-600 bg-brand-50 text-brand-700 hover:bg-brand-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isFavorite ? '♥ Favorited' : '♡ Add to favorites'}
          </button>
        </div>
      )}
    </li>
  )
}
