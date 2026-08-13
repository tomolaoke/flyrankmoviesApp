/**
 * Provides the current Firebase auth user (and loading state) to the
 * whole component tree. This is the single source of truth ViewModels
 * and ProtectedRoute read from — no component talks to `firebase/auth`
 * directly outside of `authService`.
 */
import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { auth } from '../config/firebase'
import { AuthContext } from './AuthContextInstance'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const value = useMemo(() => ({ user, isLoading }), [user, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
