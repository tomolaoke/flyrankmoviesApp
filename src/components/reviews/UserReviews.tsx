import type { Review } from '../../constants/reviews'
import { ReviewsGrid } from './ReviewsGrid'
import { ReviewsHeader } from './ReviewsHeader'

interface UserReviewsProps {
  reviews: Review[]
}

/** Bottom-of-page user reviews section, shown just above the footer. */
export function UserReviews({ reviews }: UserReviewsProps) {
  return (
    <section aria-label="User Reviews" className="flex flex-col gap-6">
      <ReviewsHeader />
      <ReviewsGrid reviews={reviews} />
    </section>
  )
}
