import type { ReactNode } from 'react'

interface UsernameProps {
  children: ReactNode
}

/** Small muted reviewer name beside the avatar. */
export function Username({ children }: UsernameProps) {
  return <span className="truncate text-sm text-gray-400">{children}</span>
}
