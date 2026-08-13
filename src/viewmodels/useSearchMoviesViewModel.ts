/**
 * ViewModel for the movie search page. Owns query/results/loading/error
 * state and talks to `omdbService` (the Model layer); the View
 * (HomePage/SearchBar/MovieList) only reads state and calls `search`.
 */
import { useCallback, useState } from 'react'
import type { Movie } from '../models/Movie'
import { OmdbApiError, searchMovies } from '../services/omdbService'

interface SearchMoviesState {
  query: string
  movies: Movie[]
  isLoading: boolean
  error: string | null
  hasSearched: boolean
}

export function useSearchMoviesViewModel() {
  const [state, setState] = useState<SearchMoviesState>({
    query: '',
    movies: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  })

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }))
  }, [])

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setState((prev) => ({ ...prev, movies: [], error: null, hasSearched: false }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const { movies } = await searchMovies(trimmed)
      setState((prev) => ({ ...prev, movies, isLoading: false, hasSearched: true }))
    } catch (err) {
      const message = err instanceof OmdbApiError ? err.message : 'Failed to search movies. Please try again.'
      setState((prev) => ({ ...prev, isLoading: false, error: message, hasSearched: true, movies: [] }))
    }
  }, [])

  return { ...state, setQuery, search }
}
