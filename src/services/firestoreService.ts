/**
 * Persists per-user data in Firestore under `users/{uid}`:
 *   - `users/{uid}/favorites/{imdbID}` documents for saved movies
 *   - `users/{uid}` document fields for settings (notificationsEnabled)
 *
 * Security relies on Firestore rules restricting each `users/{uid}`
 * subtree to its owner (see README for the rules snippet).
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { FavoriteMovie, Movie } from '../models/Movie'
import type { UserSettings } from '../models/Settings'
import type { Review } from '../constants/reviews'

function favoritesCollection(uid: string) {
  return collection(db, 'users', uid, 'favorites')
}

export async function addFavorite(uid: string, movie: Movie): Promise<void> {
  const favorite: FavoriteMovie = { ...movie, addedAt: Date.now() }
  await setDoc(doc(favoritesCollection(uid), movie.imdbID), favorite)
}

export async function removeFavorite(uid: string, imdbID: string): Promise<void> {
  await deleteDoc(doc(favoritesCollection(uid), imdbID))
}

/** Subscribes to real-time updates of a user's favorites list. */
export function subscribeToFavorites(
  uid: string,
  onChange: (favorites: FavoriteMovie[]) => void,
): Unsubscribe {
  return onSnapshot(favoritesCollection(uid), (snapshot) => {
    const favorites = snapshot.docs
      .map((d) => d.data() as FavoriteMovie)
      .sort((a, b) => b.addedAt - a.addedAt)
    onChange(favorites)
  })
}

export async function getUserSettings(uid: string): Promise<Partial<UserSettings>> {
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? (snapshot.data() as Partial<UserSettings>) : {}
}

export async function saveUserSettings(uid: string, settings: UserSettings): Promise<void> {
  await setDoc(doc(db, 'users', uid), settings, { merge: true })
}

/** Shape of a review document under `users/{uid}/reviews/{id}`. */
interface StoredUserReview {
  title: string
  content: string
  author: string
  avatar: string
  createdAt: number
}

function reviewsCollection(uid: string) {
  return collection(db, 'users', uid, 'reviews')
}

/**
 * Subscribes to the signed-in user's own Firestore reviews in real time.
 * Read-only: writing reviews (a submission UI) is intentionally out of
 * scope for now and would additionally require a Firestore rule update.
 */
export function subscribeToUserReviews(uid: string, onChange: (reviews: Review[]) => void): Unsubscribe {
  return onSnapshot(reviewsCollection(uid), (snapshot) => {
    const reviews = snapshot.docs
      .map((doc) => {
        const data = doc.data() as StoredUserReview
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          author: data.author,
          avatar: data.avatar,
          source: 'firestore' as const,
          createdAt: data.createdAt,
        }
      })
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    onChange(reviews)
  })
}
