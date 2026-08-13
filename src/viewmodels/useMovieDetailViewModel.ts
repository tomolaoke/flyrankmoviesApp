/**
 * ViewModel for the movie details page. Fetches full detail (plot, genre,
 * director, actors, runtime, rating) for a single title by IMDb ID.
 */
import { useEffect, useState } from 'react'
import type { MovieDetail } from '../models/Movie'
import { OmdbApiError, getMovieById } from '../services/omdbService'

export function useMovieDetailViewModel(imdbID: string | undefined) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imdbID) {
      setError('No movie specified.')
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    getMovieById(imdbID)
      .then((detail) => {
        if (isMounted) setMovie(detail)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err instanceof OmdbApiError ? err.message : 'Failed to load movie details.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [imdbID])

  return { movie, isLoading, error }
}
