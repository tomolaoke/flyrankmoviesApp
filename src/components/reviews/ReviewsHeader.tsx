import { SectionTitle } from './SectionTitle'
import { SeeMoreLink } from './SeeMoreLink'

/** Horizontal header row: section title on the left, See More link on the right. */
export function ReviewsHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <SectionTitle>User Reviews</SectionTitle>
      <SeeMoreLink />
    </div>
  )
}
