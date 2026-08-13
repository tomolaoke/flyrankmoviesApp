import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '../components/common/Spinner'
import { useAuthContext } from '../context/useAuthContext'

/**
 * Guards a route behind authentication. Redirects unauthenticated users
 * to /login, preserving the attempted location in router state so login
 * can send them back afterward.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthContext()
  const location = useLocation()

  if (isLoading) return <Spinner label="Checking your session" />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <>{children}</>
}
