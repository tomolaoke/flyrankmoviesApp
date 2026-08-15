import type { ReactNode } from 'react'

interface ReviewContentProps {
  children: ReactNode
}

/** Muted, compact review body text. */
export function ReviewContent({ children }: ReviewContentProps) {
  return <p className="text-sm leading-relaxed text-gray-400 line-clamp-4">{children}</p>
}
