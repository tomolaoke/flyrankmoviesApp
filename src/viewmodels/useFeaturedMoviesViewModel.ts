/**
 * ViewModel for the landing page's default grid, shown before the user
 * has searched for anything. Paginates through the curated
 * `FEATURED_TMDB_IDS` list, fetching only the current page's titles
 * (in parallel) rather than the whole list up front. Any individual
 * title that fails to load is skipped rather than failing the page.
 *
 * Also drives the hero backdrop and the Featured spotlight, which rotate
 * to a different curated title every `FEATURED_ROTATION_MS` (8 hours).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { FEATURED_TMDB_IDS } from '../constants/featuredMovies'
import type { MovieDetail } from '../models/Movie'
import { getMovieDetailsTmdb } from '../services/tmdbService'

const PAGE_SIZE = 10

/** How often the hero/Featured spotlight advances to the next curated title. */
export const FEATURED_ROTATION_MS = 8 * 60 * 60 * 1000 // 8 hours

export function useFeaturedMoviesViewModel() {
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<MovieDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [slotIndex, setSlotIndex] = useState(() => Math.floor(Date.now() / FEATURED_ROTATION_MS))
  const isMountedRef = useRef(true)

  const totalPages = Math.max(1, Math.ceil(FEATURED_TMDB_IDS.length / PAGE_SIZE))

  // Keep the spotlight in sync even if the page stays open across an 8-hour
  // slot boundary: schedule a state update for the next rotation.
  useEffect(() => {
    const now = Date.now()
    const nextBoundary = (slotIndex + 1) * FEATURED_ROTATION_MS
    const timer = setTimeout(() => {
      setSlotIndex(Math.floor(Date.now() / FEATURED_ROTATION_MS))
    }, nextBoundary - now)

    return () => clearTimeout(timer)
  }, [slotIndex])

  useEffect(() => {
    isMountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)

    const start = (page - 1) * PAGE_SIZE
    const idsForPage = FEATURED_TMDB_IDS.slice(start, start + PAGE_SIZE)

    Promise.allSettled(idsForPage.map((id) => getMovieDetailsTmdb(id))).then((results) => {
      if (!isMountedRef.current) return
      const loaded = results
        .filter((result): result is PromiseFulfilledResult<MovieDetail> => result.status === 'fulfilled')
        .map((result) => result.value)
      setMovies(loaded)
      setIsLoading(false)
    })

    return () => {
      isMountedRef.current = false
    }
  }, [page])

  const goToNextPage = useCallback(() => {
    setPage((current) => Math.min(current + 1, totalPages))
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    setPage((current) => Math.max(current - 1, 1))
  }, [])

  const movieCount = movies.length
  const spotlight = movieCount > 0 ? movies[slotIndex % movieCount] : null
  const featured = movieCount > 0 ? movies[(slotIndex + 1) % movieCount] : null

  return { movies, isLoading, page, totalPages, goToNextPage, goToPreviousPage, spotlight, featured }
}