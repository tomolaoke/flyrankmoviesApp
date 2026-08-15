import { REVIEWS } from '../../constants/reviews'
import { ReviewsGrid } from './ReviewsGrid'
import { ReviewsHeader } from './ReviewsHeader'

/** Bottom-of-page user reviews section, shown just above the footer. */
export function UserReviews() {
  return (
    <section aria-label="User Reviews" className="flex flex-col gap-6">
      <ReviewsHeader />
      <ReviewsGrid reviews={REVIEWS} />
    </section>
  )
}
