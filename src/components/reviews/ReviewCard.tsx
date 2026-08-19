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
      <div className="flex items-start justify-between gap-3">
        <ReviewTitle>{review.title}</ReviewTitle>
        {review.source === 'firestore' && (
          <span className="shrink-0 rounded-full border border-brand-400/40 bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-400">
            Firestore
          </span>
        )}
      </div>
      <ReviewContent>{review.content}</ReviewContent>
      <ReviewFooter review={review} />
    </article>
  )
}
