import { SearchBar } from '../components/movie/SearchBar'
import { MovieList } from '../components/movie/MovieList'
import { Spinner } from '../components/common/Spinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { Pagination } from '../components/common/Pagination'
import { useSearchMoviesViewModel } from '../viewmodels/useSearchMoviesViewModel'
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel'
import { useFeaturedMoviesViewModel } from '../viewmodels/useFeaturedMoviesViewModel'

/** Home / search page (View layer): renders state from the search + favorites ViewModels. */
export function HomePage() {
  const { query, movies, isLoading, error, hasSearched, search } = useSearchMoviesViewModel()
  const { isFavorite, toggleFavorite } = useFavoritesViewModel()
  const {
    movies: featuredMovies,
    isLoading: isFeaturedLoading,
    page,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = useFeaturedMoviesViewModel()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Search Movies</h1>
        <p className="mt-1 text-sm text-gray-600">Find movies by title using the OMDb database.</p>
      </div>

      <SearchBar initialValue={query} onSearch={search} isLoading={isLoading} />

      {isLoading && <Spinner label="Searching movies" />}
      {!isLoading && error && <ErrorMessage message={error} />}
      {!isLoading && !error && hasSearched && movies.length === 0 && (
        <p className="text-sm text-gray-500" role="status">
          No movies found. Try a different title.
        </p>
      )}
      {!isLoading && !error && hasSearched && movies.length > 0 && (
        <MovieList movies={movies} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
      )}

      {!hasSearched && !isLoading && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Popular right now</h2>
          {isFeaturedLoading && <Spinner label="Loading popular movies" />}
          {!isFeaturedLoading && (
            <>
              <MovieList movies={featuredMovies} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
              <Pagination page={page} totalPages={totalPages} onPrevious={goToPreviousPage} onNext={goToNextPage} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
