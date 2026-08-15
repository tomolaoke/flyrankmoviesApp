import type { ReactNode } from 'react'

interface FeaturedDescriptionProps {
  children: ReactNode
  className?: string
}

/** Muted-gray editorial description below the featured title. */
export function FeaturedDescription({ children, className = '' }: FeaturedDescriptionProps) {
  return (
    <p className={`text-sm leading-relaxed text-gray-400 line-clamp-4 ${className}`}>{children}</p>
  )
}
