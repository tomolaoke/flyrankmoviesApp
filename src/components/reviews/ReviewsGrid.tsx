import type { Review } from '../../constants/reviews'
import { ReviewCard } from './ReviewCard'

interface ReviewsGridProps {
  reviews: Review[]
}

/** Responsive grid of review cards: one column on mobile, two on desktop. */
export function ReviewsGrid({ reviews }: ReviewsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} variant={index % 2 === 0 ? 'charcoal' : 'dark'} />
      ))}
    </div>
  )
}
