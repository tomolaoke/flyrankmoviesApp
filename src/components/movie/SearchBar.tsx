import { useState, type FormEvent } from 'react'
import { Button } from '../common/Button'

interface SearchBarProps {
  initialValue?: string
  onSearch: (query: string) => void
  isLoading?: boolean
  /** `hero` variant uses translucent styling meant to sit on the cinematic hero. */
  variant?: 'default' | 'hero'
}

/** Controlled search form. Submits on Enter or button click, not on every keystroke. */
export function SearchBar({ initialValue = '', onSearch, isLoading = false, variant = 'default' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(value)
  }

  const inputClass =
    variant === 'hero'
      ? 'w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-gray-300 backdrop-blur-sm focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20'
      : 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500'

  return (
    <form onSubmit={handleSubmit} role="search" className="mx-auto flex w-full max-w-xl gap-2">
      <label htmlFor="movie-search" className="sr-only">
        Search movies by title
      </label>
      <input
        id="movie-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a movie..."
        className={inputClass}
      />
      <Button type="submit" isLoading={isLoading} variant="danger" aria-label="Search movies" className="px-6 py-3">
        Search
      </Button>
    </form>
  )
}