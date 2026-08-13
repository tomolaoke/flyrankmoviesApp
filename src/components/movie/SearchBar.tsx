import { useState, type FormEvent } from 'react'
import { Button } from '../common/Button'

interface SearchBarProps {
  initialValue?: string
  onSearch: (query: string) => void
  isLoading?: boolean
}

/** Controlled search form. Submits on Enter or button click, not on every keystroke. */
export function SearchBar({ initialValue = '', onSearch, isLoading = false }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-2">
      <label htmlFor="movie-search" className="sr-only">
        Search movies by title
      </label>
      <input
        id="movie-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a movie title..."
        className="min-w-0 flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <Button type="submit" isLoading={isLoading} aria-label="Search movies">
        Search
      </Button>
    </form>
  )
}
