import { useMovieRating } from '../../viewmodels/useMovieRating'
import type { Movie } from '../../models/Movie'

/** Small badge showing a movie's rating, lazily fetched per-card when not already present. */
export function RatingBadge({ movie }: { movie: Movie }) {
  const rating = useMovieRating(movie)

  if (!rating || rating === 'N/A') {
    return <span className="text-xs text-gray-400 dark:text-gray-500">No rating</span>
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
      aria-label={`Rating ${rating} out of 10`}
    >
      ⭐ {rating}
    </span>
  )
}