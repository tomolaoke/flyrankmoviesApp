import type { FeaturedContent } from '../../constants/featuredContent'
import { FeaturedInfo } from './FeaturedInfo'
import { FeaturedVideo } from './FeaturedVideo'
import { SectionHeading } from './SectionHeading'

interface FeaturedSectionProps {
  content: FeaturedContent
  onPlay: () => void
}

/**
 * Editorial spotlight section: a large cinematic video player paired with
 * a compact information card. Video dominates (≈70%), info supports (≈30%).
 */
export function FeaturedSection({ content, onPlay }: FeaturedSectionProps) {
  return (
    <section aria-label="Featured" className="flex flex-col gap-6">
      <SectionHeading>Featured</SectionHeading>
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[69fr_31fr]">
        <FeaturedVideo content={content} onPlay={onPlay} />
        <FeaturedInfo content={content} />
      </div>
    </section>
  )
}
