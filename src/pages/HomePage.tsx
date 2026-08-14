import { useState } from 'react'
import { SearchBar } from '../components/movie/SearchBar'
import { MovieList } from '../components/movie/MovieList'
import { VideoModal } from '../components/movie/VideoModal'
import { Spinner } from '../components/common/Spinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { Pagination } from '../components/common/Pagination'
import { Button } from '../components/common/Button'
import { MovieHero } from '../components/hero/MovieHero'
import { useSearchMoviesViewModel } from '../viewmodels/useSearchMoviesViewModel'
import { useFavoritesViewModel } from '../viewmodels/useFavoritesViewModel'
import { useFeaturedMoviesViewModel } from '../viewmodels/useFeaturedMoviesViewModel'
import { useMovieListViewModel } from '../viewmodels/useMovieListViewModel'

/** Home / search page (View layer): cinematic hero + search + movie grids. */
export function HomePage() {
  const { query, movies, isLoading, error, hasSearched, search, loadMore, totalPages, currentPage } = useSearchMoviesViewModel()
  const { isFavorite, toggleFavorite } = useFavoritesViewModel()
  const { movies: featuredMovies } = useFeaturedMoviesViewModel()
  const popular = useMovieListViewModel('popular', { pageSize: 12, maxPages: 20 })
  const nowPlaying = useMovieListViewModel('now_playing', { pageSize: 8, maxPages: 5 })
  const topRated = useMovieListViewModel('top_rated', { pageSize: 8, maxPages: 40 })

  const [videoModalMovie, setVideoModalMovie] = useState<{ tmdbId: number; title: string } | null>(null)

  const handleWatchPreview = (movie: { tmdbId?: number; title: string }) => {
    if (movie.tmdbId) {
      setVideoModalMovie({ tmdbId: movie.tmdbId, title: movie.title })
    }
  }

  const closeVideoModal = () => {
    setVideoModalMovie(null)
  }

  const canLoadMore = currentPage < totalPages
  const spotlight = featuredMovies[0] ?? null

  const heroSearchBar = (
    <SearchBar initialValue={query} onSearch={search} isLoading={isLoading} variant="hero" />
  )

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Cinematic Hero (with search bar inside) */}
      <MovieHero movie={spotlight} onWatchPreview={handleWatchPreview} searchBar={heroSearchBar} />

      <main className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-12 pt-10">
        {/* Movie Results Grid */}
        {isLoading && <Spinner label="Searching movies" />}
        {!isLoading && error && <ErrorMessage message={error} />}
        {!isLoading && !error && hasSearched && movies.length === 0 && (
          <p className="py-12 text-center text-gray-500 dark:text-gray-400" role="status">
            No movies found. Try a different title.
          </p>
        )}
        {!isLoading && !error && hasSearched && movies.length > 0 && (
          <>
            <MovieList
              movies={movies}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onWatchPreview={handleWatchPreview}
            />
            {canLoadMore && (
              <div className="flex justify-center">
                <Button variant="secondary" onClick={loadMore} isLoading={isLoading} disabled={isLoading}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <>
            {/* Popular right now */}
            <section aria-label="Popular right now" className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Popular right now</h2>
              {popular.isLoading && <Spinner label="Loading popular movies" />}
              {!popular.isLoading && popular.error && <ErrorMessage message={popular.error} />}
              {!popular.isLoading && !popular.error && (
                <>
                  <MovieList
                    movies={popular.movies}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onWatchPreview={handleWatchPreview}
                  />
                  <Pagination
                    page={popular.page}
                    totalPages={popular.totalPages}
                    onPrevious={popular.goToPreviousPage}
                    onNext={popular.goToNextPage}
                  />
                </>
              )}
            </section>

            {/* Now Playing Grid */}
            <section aria-label="Now playing" className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Now Playing</h2>
              {nowPlaying.isLoading && <Spinner label="Loading now playing" />}
              {!nowPlaying.isLoading && nowPlaying.error && <ErrorMessage message={nowPlaying.error} />}
              {!nowPlaying.isLoading && !nowPlaying.error && (
                <>
                  <MovieList
                    movies={nowPlaying.movies}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onWatchPreview={handleWatchPreview}
                  />
                  <Pagination
                    page={nowPlaying.page}
                    totalPages={nowPlaying.totalPages}
                    onPrevious={nowPlaying.goToPreviousPage}
                    onNext={nowPlaying.goToNextPage}
                  />
                </>
              )}
            </section>

            {/* Top Rated Grid */}
            <section aria-label="Top rated" className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Top Rated</h2>
              {topRated.isLoading && <Spinner label="Loading top rated" />}
              {!topRated.isLoading && topRated.error && <ErrorMessage message={topRated.error} />}
              {!topRated.isLoading && !topRated.error && (
                <>
                  <MovieList
                    movies={topRated.movies}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onWatchPreview={handleWatchPreview}
                  />
                  <Pagination
                    page={topRated.page}
                    totalPages={topRated.totalPages}
                    onPrevious={topRated.goToPreviousPage}
                    onNext={topRated.goToNextPage}
                  />
                </>
              )}
            </section>
          </>
        )}
      </main>

      {/* Video Preview Modal */}
      <VideoModal
        isOpen={videoModalMovie !== null}
        onClose={closeVideoModal}
        tmdbId={videoModalMovie?.tmdbId ?? 0}
        movieTitle={videoModalMovie?.title ?? ''}
      />
    </div>
  )
}