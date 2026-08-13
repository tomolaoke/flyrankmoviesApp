/**
 * Wraps Firebase Authentication's email/password flows. Kept separate
 * from the AuthContext/ViewModel layer so the SDK calls are mockable
 * in tests and swappable without touching UI or state-management code.
 */
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  type User,
} from 'firebase/auth'
import { auth } from '../config/firebase'

const googleProvider = new GoogleAuthProvider()

export async function signUp(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/** Signs in (or, on first use, signs up) via a Google account popup. */
export async function signInWithGoogle(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider)
  return credential.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export async function updateAccountEmail(user: User, newEmail: string): Promise<void> {
  await firebaseUpdateEmail(user, newEmail)
}

export async function updateAccountPassword(user: User, newPassword: string): Promise<void> {
  await firebaseUpdatePassword(user, newPassword)
}

/** Maps Firebase Auth error codes to short, user-facing messages. */
export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? ''

  // Logged so the real Firebase error code/message is visible in devtools
  // even though the UI only ever shows a short, generic message.
  console.error('Firebase auth error:', error)

  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in instead.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. Add it under Firebase Console > Authentication > Settings > Authorized domains.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled for this project yet.'
    default:
      return code ? `Something went wrong (${code}). Please try again.` : 'Something went wrong. Please try again.'
  }
}
