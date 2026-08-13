/**
 * OMDb's search endpoint (`s=`) doesn't include IMDb ratings — only the
 * per-title detail endpoint (`i=`) does. This hook lazily fetches just
 * the rating for a single card so MovieList can show it without an
 * expensive detail call for every search result up front... it still
 * fires one call per visible card, which is fine for OMDb's free tier
 * but would need batching/caching at larger scale.
 */
import { useEffect, useState } from 'react'
import { getMovieById } from '../services/omdbService'

export function useMovieRating(imdbID: string) {
  const [rating, setRating] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    getMovieById(imdbID)
      .then((detail) => {
        if (isMounted) setRating(detail.imdbRating)
      })
      .catch(() => {
        if (isMounted) setRating(null)
      })
    return () => {
      isMounted = false
    }
  }, [imdbID])

  return rating
}
