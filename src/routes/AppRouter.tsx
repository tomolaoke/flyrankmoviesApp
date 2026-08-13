import { Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { FavoritesPage } from '../pages/FavoritesPage'
import { HealthCheckPage } from '../pages/HealthCheckPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { MovieDetailsPage } from '../pages/MovieDetailsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SignupPage } from '../pages/SignupPage'
import { ProtectedRoute } from './ProtectedRoute'

/** Declares every route in the app. Favorites/Settings are gated by ProtectedRoute. */
export function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:imdbID" element={<MovieDetailsPage />} />
        <Route path="/health" element={<HealthCheckPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}
