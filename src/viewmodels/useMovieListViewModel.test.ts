/**
 * Unit tests for useMovieListViewModel.ts. Confirms the viewmodel loads the
 * TMDB movie list through tmdbService, applies the requested page size,
 * caps total pages at maxPages, and surfaces errors — i.e. that the TMDB
 * integration behind the Popular/Now Playing/Top Rated grids works.
 */
jest.mock('../services/tmdbService', () => ({ getMovieList: jest.fn() }))

import { renderHook, waitFor } from '@testing-library/react'
import { getMovieList } from '../services/tmdbService'
import { useMovieListViewModel } from './useMovieListViewModel'

const mockedGetMovieList = getMovieList as jest.MockedFunction<typeof getMovieList>

function makeMovies(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    imdbID: `tmdb-${i}`,
    title: `Movie ${i}`,
    year: '2024',
    poster: '',
    type: 'movie',
    tmdbId: i,
  }))
}

describe('useMovieListViewModel', () => {
  beforeEach(() => jest.clearAllMocks())

  it('loads movies from TMDB and slices them to the requested page size', async () => {
    mockedGetMovieList.mockResolvedValue({ movies: makeMovies(20), totalResults: 100, totalPages: 5 })

    const { result } = renderHook(() => useMovieListViewModel('popular', { pageSize: 12, maxPages: 20 }))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockedGetMovieList).toHaveBeenCalledWith('popular', 1)
    expect(result.current.movies).toHaveLength(12)
    expect(result.current.totalPages).toBe(5)
  })

  it('caps totalPages at maxPages', async () => {
    mockedGetMovieList.mockResolvedValue({ movies: [], totalResults: 1000, totalPages: 50 })

    const { result } = renderHook(() => useMovieListViewModel('top_rated', { pageSize: 8, maxPages: 40 }))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(40)
  })

  it('surfaces a readable error when the TMDB request fails', async () => {
    mockedGetMovieList.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useMovieListViewModel('upcoming'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.movies).toEqual([])
  })
})
