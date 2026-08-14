import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/useAuthContext'
import { useThemeContext } from '../../context/useThemeContext'
import { signOut } from '../../services/authService'
import { Button } from '../common/Button'

interface NavbarProps {
  /** Transparent overlay style used when the header sits on top of the home hero. */
  overlay?: boolean
}

const statusPillClass =
  'inline-flex items-center gap-1.5 rounded-full border border-transparent bg-red-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700'

/**
 * Top-level site navigation. In `overlay` mode it's transparent and sits
 * directly on top of the hero (white text, right-aligned links); otherwise
 * it renders as a solid bar with theme-aware colors. Shows auth-aware links
 * (Favorites/Settings/Logout vs Login/Sign up), a light/dark theme toggle,
 * and a standout Status pill pointing at the health-check page. Collapses
 * into a hamburger menu below `sm`.
 */
export function Navbar({ overlay = false }: NavbarProps) {
  const { user } = useAuthContext()
  const { theme, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    setIsMenuOpen(false)
    await signOut()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) => {
    if (overlay) {
      return `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/20 text-white'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`
    }
    return `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`
  }

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={linkClass} end onClick={() => setIsMenuOpen(false)}>
          Search
        </NavLink>
      </li>
      {user ? (
        <>
          <li>
            <NavLink to="/favorites" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Favorites
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Settings
            </NavLink>
          </li>
          <li>
            <Button variant="secondary" onClick={handleLogout} className="w-full sm:w-auto">
              Log out
            </Button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/login" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Log in
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Sign up
            </NavLink>
          </li>
        </>
      )}
    </>
  )

  const toggleIconClass = overlay
    ? 'text-white hover:bg-white/10'
    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'

  return (
    <header
      className={
        overlay
          ? 'absolute inset-x-0 top-0 z-50 bg-transparent'
          : 'border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <nav aria-label="Main navigation" className="flex items-center justify-between">
          <NavLink
            to="/"
            className={
              overlay
                ? 'text-base font-semibold text-white sm:text-lg'
                : 'text-base font-semibold text-gray-900 sm:text-lg dark:text-white'
            }
            onClick={() => setIsMenuOpen(false)}
          >
            🎬 FlyRank AI Movies
          </NavLink>

          <div className="flex items-center gap-2">
            <ul className="hidden items-center gap-2 sm:flex">{navLinks}</ul>

            <NavLink
              to="/health"
              className={statusPillClass}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Health check status"
            >
              <span aria-hidden="true">●</span> Status
            </NavLink>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${toggleIconClass}`}
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className={`flex items-center justify-center rounded-md p-2 transition-colors sm:hidden ${toggleIconClass}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <ul
          id="mobile-nav-menu"
          className="flex flex-col gap-1 border-t border-gray-200 bg-white px-4 py-3 sm:hidden dark:border-gray-800 dark:bg-gray-900"
        >
          {navLinks}
        </ul>
      )}
    </header>
  )
}