/**
 * ViewModel for the movie search page. Owns query/results/loading/error
 * state and talks to `tmdbService` (the Model layer); the View
 * (HomePage/SearchBar/MovieList) only reads state and calls `search`.
 */
import { useCallback, useState } from 'react'
import type { Movie } from '../models/Movie'
import { TmdbApiError, searchMoviesTmdb } from '../services/tmdbService'

interface SearchMoviesState {
  query: string
  movies: Movie[]
  isLoading: boolean
  error: string | null
  hasSearched: boolean
  totalPages: number
  currentPage: number
}

export function useSearchMoviesViewModel() {
  const [state, setState] = useState<SearchMoviesState>({
    query: '',
    movies: [],
    isLoading: false,
    error: null,
    hasSearched: false,
    totalPages: 0,
    currentPage: 1,
  })

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }))
  }, [])

  const search = useCallback(async (query: string, page = 1) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setState((prev) => ({ ...prev, movies: [], error: null, hasSearched: false, totalPages: 0, currentPage: 1 }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { movies, totalPages } = await searchMoviesTmdb(trimmed, page)
      setState((prev) => ({
        ...prev,
        movies: page === 1 ? movies : [...prev.movies, ...movies],
        isLoading: false,
        hasSearched: true,
        totalPages,
        currentPage: page,
      }))
    } catch (err) {
      const message = err instanceof TmdbApiError ? err.message : 'Failed to search movies. Please try again.'
      setState((prev) => ({ ...prev, isLoading: false, error: message, hasSearched: true, movies: [] }))
    }
  }, [])

  const loadMore = useCallback(async () => {
    const nextPage = state.currentPage + 1
    if (nextPage <= state.totalPages && !state.isLoading) {
      await search(state.query, nextPage)
    }
  }, [search, state.query, state.currentPage, state.totalPages, state.isLoading])

  return { ...state, setQuery, search, loadMore }
}
