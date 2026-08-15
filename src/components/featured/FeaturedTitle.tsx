import type { ReactNode } from 'react'

interface FeaturedTitleProps {
  children: ReactNode
}

/** Large bold heading for the featured editorial content. */
export function FeaturedTitle({ children }: FeaturedTitleProps) {
  return <h3 className="text-2xl font-bold leading-snug text-white">{children}</h3>
}
