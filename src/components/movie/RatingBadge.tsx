import { useMovieRating } from '../../viewmodels/useMovieRating'

/** Small badge showing a movie's IMDb rating, lazily fetched per-card. */
export function RatingBadge({ imdbID }: { imdbID: string }) {
  const rating = useMovieRating(imdbID)

  if (!rating || rating === 'N/A') {
    return <span className="text-xs text-gray-400">No rating</span>
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800"
      aria-label={`IMDb rating ${rating} out of 10`}
    >
      ⭐ {rating}
    </span>
  )
}
