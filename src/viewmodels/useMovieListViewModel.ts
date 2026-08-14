/**
 * ViewModel for TMDB movie-list categories (now playing, popular, top rated,
 * upcoming). Supports pagination with a configurable page size (TMDB returns
 * 20 per page, so results are sliced to `pageSize`) and a cap on how many
 * pages the UI may navigate through (`maxPages`).
 */
import { useCallback, useEffect, useState } from 'react'
import type { Movie } from '../models/Movie'
import { getMovieList } from '../services/tmdbService'

type Category = 'now_playing' | 'popular' | 'top_rated' | 'upcoming'

interface UseMovieListOptions {
  pageSize?: number
  maxPages?: number
}

export function useMovieListViewModel(category: Category, options: UseMovieListOptions = {}) {
  const { pageSize = 20, maxPages = Infinity } = options
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setError(null)

    getMovieList(category, page)
      .then(({ movies, totalPages }) => {
        if (!isMounted) return
        setMovies(movies.slice(0, pageSize))
        setTotalPages(Math.max(1, Math.min(totalPages, maxPages)))
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load movies.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [category, page, pageSize, maxPages])

  const goToNextPage = useCallback(() => {
    setPage((current) => Math.min(current + 1, totalPages))
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    setPage((current) => Math.max(current - 1, 1))
  }, [])

  return { movies, isLoading, error, page, totalPages, goToNextPage, goToPreviousPage }
}