import type { Movie } from '../../models/Movie'
import { MovieCard } from './MovieCard'

interface MovieListProps {
  movies: Movie[]
  isFavorite: (imdbID: string) => boolean
  onToggleFavorite: (movie: Movie) => void
}

/** Responsive grid of movie results. */
export function MovieList({ movies, isFavorite, onToggleFavorite }: MovieListProps) {
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
      aria-label="Movie search results"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={isFavorite(movie.imdbID)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  )
}
