interface GenreTagsProps {
  genres: string
}

/** Rounded, dark translucent genre pills. */
export function GenreTags({ genres }: GenreTagsProps) {
  const tags = genres
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)

  if (tags.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Genres">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-gray-100 dark:text-gray-200"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}