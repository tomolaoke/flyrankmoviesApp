import type { Review } from '../../constants/reviews'
import { ReviewContent } from './ReviewContent'
import { ReviewFooter } from './ReviewFooter'
import { ReviewTitle } from './ReviewTitle'

type CardVariant = 'charcoal' | 'dark'

const VARIANT_CLASSES: Record<CardVariant, string> = {
  charcoal: 'bg-gray-800/40 hover:bg-gray-800/60',
  dark: 'bg-gray-950 hover:bg-gray-900',
}

interface ReviewCardProps {
  review: Review
  /** Subtle surface alternation between cards (charcoal vs near-black). */
  variant?: CardVariant
}

/** A single dark review card: title, body, and reviewer footer. */
export function ReviewCard({ review, variant = 'dark' }: ReviewCardProps) {
  return (
    <article
      className={`flex flex-col gap-4 rounded-lg border border-white/10 p-6 transition-colors duration-200 hover:border-white/25 ${VARIANT_CLASSES[variant]}`}
    >
      <ReviewTitle>{review.title}</ReviewTitle>
      <ReviewContent>{review.content}</ReviewContent>
      <ReviewFooter review={review} />
    </article>
  )
}
