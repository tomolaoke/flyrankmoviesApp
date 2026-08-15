import type { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
}

/** Large heading for the reviews section header, matching the app's section headings. */
export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{children}</h2>
}
