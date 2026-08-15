import type { Review } from '../../constants/reviews'
import { ReadMore } from './ReadMore'
import { Reviewer } from './Reviewer'

interface ReviewFooterProps {
  review: Review
}

/** Bottom row of a review card: reviewer identity on the left, Read More on the right. */
export function ReviewFooter({ review }: ReviewFooterProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-4">
      <Reviewer avatar={review.avatar} name={review.author} />
      <ReadMore />
    </div>
  )
}
