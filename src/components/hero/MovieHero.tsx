import type { ReactNode } from 'react'
import { HeroBackground } from './HeroBackground'
import { HeroContent } from './HeroContent'
import { PlayButton } from './PlayButton'
import type { MovieDetail } from '../../models/Movie'

interface MovieHeroProps {
  movie: MovieDetail | null
  onWatchPreview: (movie: MovieDetail) => void
  /** Optional search form rendered inside the hero content column. */
  searchBar?: ReactNode
}

/**
 * Full-width cinematic hero: layered background image with overlays,
 * a floating play button, and lower-left movie information.
 */
export function MovieHero({ movie, onWatchPreview, searchBar }: MovieHeroProps) {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden sm:min-h-[85vh]" aria-label="Featured movie">
      <HeroBackground backdrop={movie?.backdrop} />

      {movie && <PlayButton movieTitle={movie.title} onPlay={() => onWatchPreview(movie)} />}

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          {movie && <HeroContent movie={movie} onWatchPreview={onWatchPreview} />}
          {searchBar && <div className="mt-10">{searchBar}</div>}
        </div>
      </div>
    </section>
  )
}