import type { FeaturedContent } from '../../constants/featuredContent'
import { CastList } from '../hero/CastList'
import { GenreTags } from '../hero/GenreTags'
import { MovieMetadata } from '../hero/MovieMetadata'
import { FeaturedDate } from './FeaturedDate'
import { FeaturedDescription } from './FeaturedDescription'
import { FeaturedTitle } from './FeaturedTitle'

interface FeaturedInfoProps {
  content: FeaturedContent
}

/** Compact dark editorial panel beside the featured video. */
export function FeaturedInfo({ content }: FeaturedInfoProps) {
  return (
    <aside className="flex flex-col rounded-lg border border-gray-800 bg-gray-950 p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <FeaturedTitle>{content.title}</FeaturedTitle>
        {content.ageRating && (
          <span
            className="mt-1 shrink-0 rounded-full border border-white/40 bg-white/10 px-2.5 py-1 text-xs font-bold text-white"
            aria-label={`Age rating ${content.ageRating}`}
          >
            {content.ageRating}
          </span>
        )}
      </div>

      <FeaturedDescription className="mt-4">{content.description}</FeaturedDescription>

      {content.cast && content.cast.length > 0 && (
        <div className="mt-5">
          <CastList cast={content.cast} />
        </div>
      )}

      {content.imdbRating && content.runtime && content.year && (
        <div className="mt-5">
          <MovieMetadata
            imdbRating={content.imdbRating}
            runtime={content.runtime}
            year={content.year}
          />
        </div>
      )}

      {content.genre && (
        <div className="mt-5">
          <GenreTags genres={content.genre} />
        </div>
      )}

      <FeaturedDate className="mt-auto pt-6">{content.date}</FeaturedDate>
    </aside>
  )
}
