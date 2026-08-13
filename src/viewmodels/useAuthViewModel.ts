/**
 * ViewModel backing the Login/Signup pages: wraps `authService` calls
 * with loading/error state so the form components stay presentational.
 */
import { useCallback, useState } from 'react'
import { getAuthErrorMessage, signIn, signInWithGoogle, signUp } from '../services/authService'

export function useAuthViewModel() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)
    try {
      await signIn(email, password)
      return true
    } catch (err) {
      setError(getAuthErrorMessage(err))
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)
    try {
      await signUp(email, password)
      return true
    } catch (err) {
      setError(getAuthErrorMessage(err))
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)
    try {
      await signInWithGoogle()
      return true
    } catch (err) {
      setError(getAuthErrorMessage(err))
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { login, register, loginWithGoogle, isSubmitting, error }
}
