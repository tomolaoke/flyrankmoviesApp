/**
 * ViewModel for the landing page's default grid, shown before the user
 * has searched for anything. Paginates through the curated
 * `FEATURED_IMDB_IDS` list, fetching only the current page's titles
 * (in parallel) rather than the whole list up front. Any individual
 * title that fails to load is skipped rather than failing the page.
 */
import { useCallback, useEffect, useState } from 'react'
import { FEATURED_IMDB_IDS } from '../constants/featuredMovies'
import type { MovieDetail } from '../models/Movie'
import { getMovieById } from '../services/omdbService'

const PAGE_SIZE = 10

export function useFeaturedMoviesViewModel() {
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<MovieDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const totalPages = Math.max(1, Math.ceil(FEATURED_IMDB_IDS.length / PAGE_SIZE))

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const start = (page - 1) * PAGE_SIZE
    const idsForPage = FEATURED_IMDB_IDS.slice(start, start + PAGE_SIZE)

    Promise.allSettled(idsForPage.map((id) => getMovieById(id))).then((results) => {
      if (!isMounted) return
      const loaded = results
        .filter((result): result is PromiseFulfilledResult<MovieDetail> => result.status === 'fulfilled')
        .map((result) => result.value)
      setMovies(loaded)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [page])

  const goToNextPage = useCallback(() => {
    setPage((current) => Math.min(current + 1, totalPages))
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    setPage((current) => Math.max(current - 1, 1))
  }, [])

  return { movies, isLoading, page, totalPages, goToNextPage, goToPreviousPage }
}
