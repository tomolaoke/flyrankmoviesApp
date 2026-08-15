import type { ReactNode } from 'react'

interface FeaturedDateProps {
  children: ReactNode
  className?: string
}

/** Small muted publication date for the featured content. */
export function FeaturedDate({ children, className = '' }: FeaturedDateProps) {
  return <time className={`text-xs text-gray-500 ${className}`}>{children}</time>
}
