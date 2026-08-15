import type { ReactNode } from 'react'

interface SectionHeadingProps {
  children: ReactNode
}

/** Section title, matching the other home-page section headings. */
export function SectionHeading({ children }: SectionHeadingProps) {
  return <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{children}</h2>
}
