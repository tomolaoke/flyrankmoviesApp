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
