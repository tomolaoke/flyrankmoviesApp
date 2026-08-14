interface MovieMetadataProps {
  imdbRating: string
  runtime: string
  year: string
}

/** Compact metadata row: IMDb score, runtime, and release year. */
export function MovieMetadata({ imdbRating, runtime, year }: MovieMetadataProps) {
  return (
    <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-100 dark:text-gray-200">
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 items-center rounded bg-yellow-400 px-1 text-[10px] font-extrabold tracking-tight text-black">
          IMDb
        </span>
        <dt className="sr-only">IMDb rating</dt>
        <dd className="font-semibold">
          {imdbRating}
          <span className="font-normal text-gray-300 dark:text-gray-400">/10</span>
        </dd>
      </div>

      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-gray-300 dark:text-gray-400">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <dt className="sr-only">Runtime</dt>
        <dd>{runtime}</dd>
      </div>

      <div className="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-gray-300 dark:text-gray-400">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <dt className="sr-only">Release year</dt>
        <dd>{year}</dd>
      </div>
    </dl>
  )
}