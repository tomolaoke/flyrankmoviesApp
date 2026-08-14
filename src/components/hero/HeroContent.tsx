import { CastList } from './CastList'
import { GenreTags } from './GenreTags'
import { MovieMetadata } from './MovieMetadata'
import type { MovieDetail } from '../../models/Movie'

interface HeroContentProps {
  movie: MovieDetail
  onWatchPreview: (movie: MovieDetail) => void
}

/** Lower-left content block: title, age badge, description, cast, metadata, genres. */
export function HeroContent({ movie, onWatchPreview }: HeroContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
          {movie.title}
        </h1>
        {movie.ageRating && (
          <span
            className="rounded-full border border-white/40 bg-white/10 px-2.5 py-1 text-xs font-bold text-white"
            aria-label={`Age rating ${movie.ageRating}`}
          >
            {movie.ageRating}
          </span>
        )}
      </div>

      <p className="max-w-md text-sm leading-relaxed text-gray-200 sm:text-base dark:text-gray-300">
        {movie.plot}
      </p>

      <CastList cast={movie.cast} />

      <MovieMetadata imdbRating={movie.imdbRating} runtime={movie.runtime} year={movie.year} />

      <GenreTags genres={movie.genre} />

      <button
        type="button"
        onClick={() => onWatchPreview(movie)}
        aria-label={`Play preview of ${movie.title}`}
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/20"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch Preview
      </button>
    </div>
  )
}