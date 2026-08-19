/**
 * Unit tests for healthService.ts. Confirms the TMDB token/base URL are part
 * of the required env var checks and that checkTmdbConnection() reports a
 * real TMDB search result (or a readable failure) — i.e. that the TMDB
 * integration behind the /health page works.
 *
 * `../config/env` is mocked so `import.meta.env` is never touched in Jest
 * (it doesn't exist in CommonJS output). All external services are mocked
 * too, keeping this test focused on healthService's own logic.
 */
jest.mock('../config/env', () => ({ getEnv: jest.fn() }))
jest.mock('../config/firebase', () => ({ db: {} }))
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
}))
jest.mock('./omdbService', () => ({ searchMovies: jest.fn() }))
jest.mock('./tmdbService', () => ({ searchMoviesTmdb: jest.fn() }))

import { getEnv } from '../config/env'
import { checkEnvVars, checkTmdbConnection, REQUIRED_ENV_VARS } from './healthService'
import { searchMoviesTmdb } from './tmdbService'

const mockedGetEnv = getEnv as jest.MockedFunction<typeof getEnv>
const mockedSearchTmdb = searchMoviesTmdb as jest.MockedFunction<typeof searchMoviesTmdb>

describe('checkEnvVars', () => {
  beforeEach(() => jest.clearAllMocks())

  it('includes the TMDB token and base URL in the required variables', () => {
    expect(REQUIRED_ENV_VARS).toContain('VITE_TMDB_API_TOKEN')
    expect(REQUIRED_ENV_VARS).toContain('VITE_TMDB_BASE_URL')
  })

  it('reports TMDB variables as present when the env value is set', () => {
    mockedGetEnv.mockReturnValue('set')
    const result = checkEnvVars()
    expect(result.find((v) => v.name === 'VITE_TMDB_API_TOKEN')?.present).toBe(true)
    expect(result.find((v) => v.name === 'VITE_TMDB_BASE_URL')?.present).toBe(true)
    expect(result.every((v) => v.present)).toBe(true)
  })

  it('reports missing variables when the env value is not set', () => {
    mockedGetEnv.mockReturnValue(undefined)
    const result = checkEnvVars()
    expect(result.every((v) => !v.present)).toBe(true)
  })
})

describe('checkTmdbConnection', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns ok with real sample movies when the TMDB search succeeds', async () => {
    const barbie = {
      imdbID: 'tmdb-346698',
      title: 'Barbie',
      year: '2023',
      poster: '',
      type: 'movie',
      tmdbId: 346698,
    }
    mockedSearchTmdb.mockResolvedValue({ movies: [barbie], totalResults: 1, totalPages: 1 })

    const result = await checkTmdbConnection()

    expect(mockedSearchTmdb).toHaveBeenCalledWith('barbie')
    expect(result.status).toBe('ok')
    expect(result.message).toContain('barbie')
    expect(result.sampleMovies).toEqual([barbie])
    expect(result.latencyMs).toBeGreaterThanOrEqual(0)
  })

  it('returns an error with a readable message when the TMDB search throws', async () => {
    mockedSearchTmdb.mockRejectedValue(new Error('TMDB is unreachable'))

    const result = await checkTmdbConnection()

    expect(result.status).toBe('error')
    expect(result.message).toContain('TMDB is unreachable')
    expect(result.sampleMovies).toEqual([])
  })
})