import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

/** Page shell: nav bar + a landmark `<main>` region for each route's content. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  )
}
