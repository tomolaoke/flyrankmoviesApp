import type { Movie } from '../../models/Movie'
import { MovieCard } from './MovieCard'

interface MovieListProps {
  movies: Movie[]
  isFavorite: (imdbID: string) => boolean
  onToggleFavorite: (movie: Movie) => void
  onWatchPreview?: (movie: Movie) => void
}

/** Responsive grid of movie results. */
export function MovieList({
  movies,
  isFavorite,
  onToggleFavorite,
  onWatchPreview,
}: MovieListProps) {
  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      aria-label="Movie search results"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={isFavorite(movie.imdbID)}
          onToggleFavorite={onToggleFavorite}
          onWatchPreview={onWatchPreview}
        />
      ))}
    </ul>
  )
}
