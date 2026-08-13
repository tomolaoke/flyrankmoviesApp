/**
 * ViewModel for the Favorites page. Subscribes to the signed-in user's
 * Firestore favorites in real time and exposes add/remove/isFavorite
 * helpers so any view (MovieCard, FavoritesPage) can toggle favorites
 * without knowing about Firestore.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthContext } from '../context/useAuthContext'
import type { FavoriteMovie, Movie } from '../models/Movie'
import { addFavorite, removeFavorite, subscribeToFavorites } from '../services/firestoreService'

export function useFavoritesViewModel() {
  const { user } = useAuthContext()
  const [rawFavorites, setRawFavorites] = useState<FavoriteMovie[]>([])
  // Tracks which uid `rawFavorites` was last populated for, so switching
  // users (or logging out) doesn't briefly show the previous user's data.
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToFavorites(user.uid, (next) => {
      setRawFavorites(next)
      setLoadedForUid(user.uid)
    })
    return unsubscribe
  }, [user])

  const favorites = useMemo(
    () => (user && loadedForUid === user.uid ? rawFavorites : []),
    [user, loadedForUid, rawFavorites],
  )
  const isLoading = Boolean(user) && loadedForUid !== user?.uid

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.imdbID)), [favorites])
  const isFavorite = useCallback((imdbID: string) => favoriteIds.has(imdbID), [favoriteIds])

  const toggleFavorite = useCallback(
    async (movie: Movie) => {
      if (!user) return
      setError(null)
      try {
        if (favoriteIds.has(movie.imdbID)) {
          await removeFavorite(user.uid, movie.imdbID)
        } else {
          await addFavorite(user.uid, movie)
        }
      } catch {
        setError('Could not update favorites. Please try again.')
      }
    },
    [user, favoriteIds],
  )

  return { favorites, isLoading, error, isFavorite, toggleFavorite }
}
