import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/** Page shell: nav bar + a landmark `<main>` region for each route's content. */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar overlay={isHome} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}