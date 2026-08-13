/**
 * Lightweight connectivity checks for the health-check page. Each check
 * (besides the env var presence check) makes a real minimal call against
 * the external service it's checking, so the page proves the app can
 * actually reach OMDb/Firestore — not just that env vars look plausible.
 */
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Movie } from '../models/Movie'
import { searchMovies } from './omdbService'

const REQUIRED_ENV_VARS = [
  'VITE_OMDB_API_KEY',
  'VITE_OMDB_BASE_URL',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

export interface EnvVarCheck {
  name: string
  present: boolean
}

/** Reports which required `VITE_*` env vars are set (not their values). */
export function checkEnvVars(): EnvVarCheck[] {
  return REQUIRED_ENV_VARS.map((name) => ({
    name,
    present: Boolean(import.meta.env[name]),
  }))
}

export interface OmdbHealthResult {
  status: 'ok' | 'error'
  message: string
  latencyMs: number
  sampleMovies: Movie[]
}

/** Runs a real OMDb search so the page can render actually-fetched data, not just a ping. */
export async function checkOmdbConnection(): Promise<OmdbHealthResult> {
  const startedAt = performance.now()
  try {
    const { movies } = await searchMovies('batman')
    return {
      status: 'ok',
      message: `Fetched ${movies.length} result(s) for a test search ("batman").`,
      latencyMs: Math.round(performance.now() - startedAt),
      sampleMovies: movies.slice(0, 5),
    }
  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - startedAt),
      sampleMovies: [],
    }
  }
}

export interface FirestoreHealthResult {
  status: 'ok' | 'permission-denied' | 'error'
  message: string
  latencyMs: number
}

/**
 * Attempts a minimal Firestore read. Security rules restrict all data to
 * signed-in owners, so a `permission-denied` response still proves the SDK
 * reached Firestore — only network/config failures (bad project ID, offline,
 * etc.) count as `error`.
 */
export async function checkFirestoreConnection(): Promise<FirestoreHealthResult> {
  const startedAt = performance.now()
  try {
    await getDocs(query(collection(db, 'health'), limit(1)))
    return {
      status: 'ok',
      message: 'Firestore read succeeded.',
      latencyMs: Math.round(performance.now() - startedAt),
    }
  } catch (err) {
    const code = (err as { code?: string })?.code
    if (code === 'permission-denied') {
      return {
        status: 'permission-denied',
        message: 'Reached Firestore, but the read was denied by security rules (expected while signed out).',
        latencyMs: Math.round(performance.now() - startedAt),
      }
    }
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      latencyMs: Math.round(performance.now() - startedAt),
    }
  }
}
