import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/useAuthContext'
import { signOut } from '../../services/authService'
import { Button } from '../common/Button'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-700' : 'text-gray-700 hover:bg-gray-100'}`

/**
 * Top-level site navigation. Shows auth-aware links (Favorites/Settings/Logout
 * vs Login/Sign up). Collapses into a hamburger menu below the `sm` breakpoint.
 */
export function Navbar() {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    setIsMenuOpen(false)
    await signOut()
    navigate('/')
  }

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={linkClass} end onClick={() => setIsMenuOpen(false)}>
          Search
        </NavLink>
      </li>
      {user && (
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
      )}
      {!user && (
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

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <nav aria-label="Main navigation" className="flex items-center justify-between">
          <NavLink to="/" className="text-base font-semibold text-gray-900 sm:text-lg" onClick={() => setIsMenuOpen(false)}>
            🎬 FlyRank AI Movies
          </NavLink>

          <ul className="hidden items-center gap-2 sm:flex">{navLinks}</ul>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 sm:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        <p className="mt-1 text-[11px] leading-snug text-gray-500">
          Designed with Claude Code by Tomola Oke, Frontend AI Engineering Intern at FlyRankAI ·{' '}
          <NavLink to="/health" className="underline hover:text-gray-700">
            Status
          </NavLink>
        </p>
      </div>

      {isMenuOpen && (
        <ul id="mobile-nav-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 py-3 sm:hidden">
          {navLinks}
        </ul>
      )}
    </header>
  )
}
