interface SeeMoreLinkProps {
  label?: string
}

/** Subtle navigation-style link in the reviews section header. */
export function SeeMoreLink({ label = 'See More' }: SeeMoreLinkProps) {
  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      className="text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      {label}
    </a>
  )
}
