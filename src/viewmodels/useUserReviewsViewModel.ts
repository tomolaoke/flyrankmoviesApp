/**
 * ViewModel for the home page's "User Reviews" section.
 *
 * Fetches the TMDB reviews for the currently-featured movie and, when a
 * user is signed in, subscribes to their own Firestore reviews so those
 * appear alongside the TMDB ones (highlighted in the UI). Falls back to
 * the curated sample reviews whenever there is no featured movie yet or
 * TMDB has no reviews for it, so the section is never empty.
 */
import { useEffect, useMemo, useState } from 'react'
import { REVIEWS, type Review } from '../constants/reviews'
import { useAuthContext } from '../context/useAuthContext'
import { subscribeToUserReviews } from '../services/firestoreService'
import { getMovieReviews } from '../services/tmdbService'

/** Cap for how many TMDB reviews are shown so the section stays compact. */
const MAX_TMDB_REVIEWS = 6

export function useUserReviewsViewModel(tmdbId?: number) {
  const { user } = useAuthContext()
  const [tmdbReviews, setTmdbReviews] = useState<Review[]>([])
  const [firestoreState, setFirestoreState] = useState<{ uid: string | null; reviews: Review[] }>({
    uid: null,
    reviews: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    if (!tmdbId) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setError(null)

    getMovieReviews(tmdbId)
      .then((reviews) => {
        if (isMounted) setTmdbReviews(reviews)
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load reviews.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [tmdbId])

  useEffect(() => {
    if (!user?.uid) return
    return subscribeToUserReviews(user.uid, (reviews) => {
      setFirestoreState({ uid: user.uid, reviews })
    })
  }, [user?.uid])

  const reviews = useMemo(() => {
    const visibleFirestoreReviews = firestoreState.uid === user?.uid ? firestoreState.reviews : []
    const base = tmdbId && tmdbReviews.length > 0 ? tmdbReviews.slice(0, MAX_TMDB_REVIEWS) : REVIEWS
    return [...base, ...visibleFirestoreReviews]
  }, [tmdbId, tmdbReviews, firestoreState, user?.uid])

  return { reviews, isLoading, error }
}