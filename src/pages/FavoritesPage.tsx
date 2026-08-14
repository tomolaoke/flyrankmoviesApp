import { MovieList } from '../components/movie/MovieList'
import { Spinner } from '../components/common/Spinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel'

/** Protected page listing the signed-in user's saved favorite movies (real-time via Firestore). */
export function FavoritesPage() {
  const { favorites, isLoading, error, isFavorite, toggleFavorite } = useFavoritesViewModel()

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Favorites</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Movies you've saved to your account.</p>
        </div>

        {error && <ErrorMessage message={error} />}
        {isLoading && <Spinner label="Loading favorites" />}
        {!isLoading && favorites.length === 0 && (
          <p className="py-12 text-center text-gray-500 dark:text-gray-400" role="status">
            You haven't added any favorites yet. Go search for a movie!
          </p>
        )}
        {!isLoading && favorites.length > 0 && (
          <MovieList movies={favorites} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
        )}
      </div>
    </div>
  )
}