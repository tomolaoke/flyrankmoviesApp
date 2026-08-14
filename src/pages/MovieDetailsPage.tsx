import { Link, useParams } from 'react-router-dom'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { Spinner } from '../components/common/Spinner'
import { VideoModal } from '../components/movie/VideoModal'
import { useAuthContext } from '../context/useAuthContext'
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel'
import { useMovieDetailViewModel } from '../viewmodels/useMovieDetailViewModel'
import { Button } from '../components/common/Button'
import { useState } from 'react'

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="445" viewBox="0 0 300 445"><rect width="300" height="445" fill="%23374151"/><text x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="18">No Poster</text></svg>'

/** Full detail view for a single movie: poster, plot, genre, director, cast, runtime, and rating. */
export function MovieDetailsPage() {
  const { imdbID } = useParams<{ imdbID: string }>()
  const { movie, isLoading, error } = useMovieDetailViewModel(imdbID)
  const { user } = useAuthContext()
  const { isFavorite, toggleFavorite } = useFavoritesViewModel()
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  if (isLoading) return <Spinner label="Loading movie details" />
  if (error) return <ErrorMessage message={error} />
  if (!movie) return null

  const favorited = isFavorite(movie.imdbID)

  const openPreview = () => {
    if (movie.tmdbId) setIsVideoOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          to="/"
          className="self-start text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
        >
          ← Back to search
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row">
          <img
            src={movie.poster || FALLBACK_POSTER}
            alt={`Poster for ${movie.title}`}
            className="mx-auto aspect-[2/3] w-48 flex-shrink-0 rounded-lg object-cover shadow-lg sm:mx-0 sm:w-64"
          />

          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">{movie.title}</h1>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 sm:grid-cols-4 dark:text-gray-400">
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Year</dt>
                <dd>{movie.year}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Runtime</dt>
                <dd>{movie.runtime}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Rating</dt>
                <dd aria-label={`IMDb rating ${movie.imdbRating} out of 10`}>⭐ {movie.imdbRating}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900 dark:text-white">Genre</dt>
                <dd>{movie.genre}</dd>
              </div>
            </dl>

            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{movie.plot}</p>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-gray-900 dark:text-white">Director:</span> {movie.director || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">Cast:</span> {movie.actors || 'N/A'}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {movie.tmdbId && (
                <Button variant="primary" onClick={openPreview} aria-label={`Watch a short preview of ${movie.title}`}>
                  ▶ Watch Preview
                </Button>
              )}
              {user && (
                <Button
                  variant={favorited ? 'secondary' : 'primary'}
                  onClick={() => toggleFavorite(movie)}
                  aria-pressed={favorited}
                  aria-label={favorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
                >
                  {favorited ? '♥ Favorited' : '♡ Add to favorites'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          tmdbId={movie.tmdbId ?? 0}
          movieTitle={movie.title}
        />
      </div>
    </div>
  )
}