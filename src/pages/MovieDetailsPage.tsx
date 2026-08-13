import { Link, useParams } from 'react-router-dom'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { Spinner } from '../components/common/Spinner'
import { useAuthContext } from '../context/useAuthContext'
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel'
import { useMovieDetailViewModel } from '../viewmodels/useMovieDetailViewModel'

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="445" viewBox="0 0 300 445"><rect width="300" height="445" fill="%23e5e7eb"/><text x="50%25" y="50%25" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="18">No Poster</text></svg>'

/** Full detail view for a single movie: poster, plot, genre, director, cast, runtime, and rating. */
export function MovieDetailsPage() {
  const { imdbID } = useParams<{ imdbID: string }>()
  const { movie, isLoading, error } = useMovieDetailViewModel(imdbID)
  const { user } = useAuthContext()
  const { isFavorite, toggleFavorite } = useFavoritesViewModel()

  if (isLoading) return <Spinner label="Loading movie details" />
  if (error) return <ErrorMessage message={error} />
  if (!movie) return null

  const favorited = isFavorite(movie.imdbID)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="self-start text-sm font-medium text-brand-600 hover:underline">
        ← Back to search
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={movie.poster || FALLBACK_POSTER}
          alt={`Poster for ${movie.title}`}
          className="mx-auto aspect-[2/3] w-48 flex-shrink-0 rounded-lg object-cover shadow-sm sm:mx-0 sm:w-64"
        />

        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{movie.title}</h1>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 sm:grid-cols-4">
            <div>
              <dt className="font-medium text-gray-900">Year</dt>
              <dd>{movie.year}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Runtime</dt>
              <dd>{movie.runtime}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Rating</dt>
              <dd aria-label={`IMDb rating ${movie.imdbRating} out of 10`}>⭐ {movie.imdbRating}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Genre</dt>
              <dd>{movie.genre}</dd>
            </div>
          </dl>

          <p className="text-sm leading-relaxed text-gray-700">{movie.plot}</p>

          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Director:</span> {movie.director}
            </p>
            <p>
              <span className="font-medium text-gray-900">Cast:</span> {movie.actors}
            </p>
          </div>

          {user && (
            <button
              type="button"
              onClick={() => toggleFavorite(movie)}
              aria-pressed={favorited}
              aria-label={favorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
              className={`mt-2 self-start rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                favorited
                  ? 'border-brand-600 bg-brand-50 text-brand-700 hover:bg-brand-100'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {favorited ? '♥ Favorited' : '♡ Add to favorites'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
