import type { ReactNode } from 'react'

interface ReviewTitleProps {
  children: ReactNode
}

/** Short, white, medium-weight heading at the top of a review card. */
export function ReviewTitle({ children }: ReviewTitleProps) {
  return <h3 className="text-base font-semibold text-white">{children}</h3>
}
