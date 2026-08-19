/**
 * Data model + sample data for the home page's "User Reviews" section.
 * Kept separate from the visual components so the section can later be
 * driven by a real reviews API/backend without touching the UI.
 */
export interface Review {
  id: string
  title: string
  content: string
  author: string
  /** Avatar image source; swap for a real user avatar URL later. */
  avatar: string
  /** Where the review came from: a live API (tmdb) or the signed-in user's Firestore. */
  source?: 'tmdb' | 'firestore'
  /** Optional reviewer star rating (0–10 for TMDB, out of 5 for Firestore). */
  rating?: number
  /** Epoch ms when the review was created/added. */
  createdAt?: number
}

/** Deterministic muted initials avatar, so the cards work with no image assets. */
export function initialsAvatar(name: string, background: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return (
    'data:image/svg+xml;utf8,' +
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="32" fill="${background}"/>` +
    `<text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="22" font-weight="600">${initials}</text>` +
    '</svg>'
  )
}

export const REVIEWS: Review[] = [
  {
    id: '1',
    title: 'Fantastic 👌',
    content:
      "First of all, this is a fantastic show. Beautifully shot and brilliantly acted from start to finish — easily one of the best things I've watched in a long time.",
    author: 'David Will',
    avatar: initialsAvatar('David Will', '%23475569'),
  },
  {
    id: '2',
    title: 'First Episode✨',
    content:
      "First episode? One of the best openings I saw on TV. It was soooo good. It was an awesome premiere of other goods to come. Second episode? Awesome world-building.",
    author: 'Abdollah',
    avatar: initialsAvatar('Abdollah', '%23334155'),
  },
  {
    id: '3',
    title: 'So Bad 👎',
    content:
      "As a fan of the games there really isn't anything bad to say here. The show captures the tone perfectly and every performance lands. Highly recommended for newcomers and longtime fans alike.",
    author: 'Melissa Pinkman',
    avatar: initialsAvatar('Melissa Pinkman', '%23565f79'),
  },
  {
    id: '4',
    title: 'Great 👌',
    content:
      "First of all, I'd like to make it clear that I'm writing this review because the show truly deserves it. Great writing, great acting, and a faithful adaptation that stands on its own.",
    author: 'Sarah Williams',
    avatar: initialsAvatar('Sarah Williams', '%2339475f'),
  },
]
