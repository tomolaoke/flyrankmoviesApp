interface PaginationProps {
  page: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

/** Prev/next arrow pagination with a "Page X of Y" indicator. */
export function Pagination({ page, totalPages, onPrevious, onNext }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700
          transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40
          dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700
          transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40
          dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </nav>
  )
}