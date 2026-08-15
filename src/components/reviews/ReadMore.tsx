interface ReadMoreProps {
  label?: string
}

/** Subtle editorial link in the bottom-right corner of a review card. */
export function ReadMore({ label = 'Read More' }: ReadMoreProps) {
  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      className="shrink-0 text-xs font-medium text-gray-500 underline-offset-2 transition-colors duration-150 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {label}
    </a>
  )
}
