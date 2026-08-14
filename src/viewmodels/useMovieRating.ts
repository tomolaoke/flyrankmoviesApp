/**
 * Returns a movie's rating. TMDB search results already include a
 * `vote_average` (surfaced on the Movie model), so when present we use it
 * directly and skip the extra network call. OMDb's search endpoint doesn't
 * include ratings, so for OMDb-backed titles we lazily fetch just the
 * rating from the per-title detail endpoint. Failures degrade gracefully
 * to "no rating" on the card.
 */
import { useEffect, useState } from 'react'
import type { Movie } from '../models/Movie'
import { getMovieById } from '../services/omdbService'

export function useMovieRating(movie: Movie) {
  const [rating, setRating] = useState<string | null>(movie.rating ?? null)

  useEffect(() => {
    if (movie.rating) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(movie.rating)
      return
    }

    let isMounted = true
    getMovieById(movie.imdbID)
      .then((detail) => {
        if (isMounted) setRating(detail.imdbRating)
      })
      .catch(() => {
        if (isMounted) setRating(null)
      })
    return () => {
      isMounted = false
    }
  }, [movie.imdbID, movie.rating])

  return rating
}