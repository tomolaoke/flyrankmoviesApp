/**
 * ViewModel for the health-check page. Runs the env var, OMDb, and
 * Firestore checks and exposes their results plus a way to re-run them.
 */
import { useCallback, useEffect, useState } from 'react'
import {
  checkEnvVars,
  checkFirestoreConnection,
  checkOmdbConnection,
  type EnvVarCheck,
  type FirestoreHealthResult,
  type OmdbHealthResult,
} from '../services/healthService'

export function useHealthCheckViewModel() {
  const [envVars] = useState<EnvVarCheck[]>(() => checkEnvVars())
  const [omdb, setOmdb] = useState<OmdbHealthResult | null>(null)
  const [firestore, setFirestore] = useState<FirestoreHealthResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const runChecks = useCallback(async () => {
    setIsChecking(true)
    const [omdbResult, firestoreResult] = await Promise.all([checkOmdbConnection(), checkFirestoreConnection()])
    setOmdb(omdbResult)
    setFirestore(firestoreResult)
    setIsChecking(false)
  }, [])

  useEffect(() => {
    runChecks()
  }, [runChecks])

  return { envVars, omdb, firestore, isChecking, runChecks }
}
