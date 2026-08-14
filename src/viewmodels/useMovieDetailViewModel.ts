/**
 * ViewModel for the movie details page. Fetches full detail (plot, genre,
 * director, actors, runtime, rating) for a single title.
 *
 * The route param can be either:
 *  - a TMDB-backed id (`tmdb-<number>`), from TMDB search results, or
 *  - a legacy IMDb id (`tt...`), e.g. favorites saved before TMDB support.
 * It routes accordingly so the correct provider is used.
 */
import { useEffect, useRef, useState } from 'react'
import type { MovieDetail } from '../models/Movie'
import { OmdbApiError, getMovieById } from '../services/omdbService'
import { TmdbApiError, getMovieDetailsTmdb } from '../services/tmdbService'

const TMDB_ID_PREFIX = 'tmdb-'

export function useMovieDetailViewModel(imdbID: string | undefined) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    if (!imdbID) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('No movie specified.')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null)

    const isTmdbId = imdbID.startsWith(TMDB_ID_PREFIX)
    const request = isTmdbId
      ? getMovieDetailsTmdb(Number(imdbID.slice(TMDB_ID_PREFIX.length)))
      : getMovieById(imdbID)

    request
      .then((detail) => {
        if (isMountedRef.current) setMovie(detail)
      })
      .catch((err) => {
        if (!isMountedRef.current) return
        const knownError = err instanceof OmdbApiError || err instanceof TmdbApiError
        setError(knownError ? err.message : 'Failed to load movie details.')
      })
      .finally(() => {
        if (isMountedRef.current) setIsLoading(false)
      })

    return () => {
      isMountedRef.current = false
    }
  }, [imdbID])

  return { movie, isLoading, error }
}