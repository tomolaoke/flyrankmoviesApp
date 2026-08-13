/**
 * ViewModel for the Settings page. Loads the signed-in user's saved
 * settings from Firestore and persists updates, coordinating with
 * Firebase Auth for email/password changes when those fields are edited.
 */
import { useCallback, useEffect, useState } from 'react'
import { useAuthContext } from '../context/useAuthContext'
import { getAuthErrorMessage, updateAccountEmail, updateAccountPassword } from '../services/authService'
import { getUserSettings, saveUserSettings } from '../services/firestoreService'
import type { SettingsFormValues } from '../schemas/settingsSchema'

export function useSettingsViewModel() {
  const { user } = useAuthContext()
  const [initialValues, setInitialValues] = useState<{ email: string; notificationsEnabled: boolean } | null>(null)
  // Tracks which uid `initialValues` was last loaded for, so switching
  // users doesn't briefly show the previous user's settings.
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let isMounted = true
    getUserSettings(user.uid).then((saved) => {
      if (!isMounted) return
      setInitialValues({
        email: saved.email ?? user.email ?? '',
        notificationsEnabled: saved.notificationsEnabled ?? false,
      })
      setLoadedForUid(user.uid)
    })
    return () => {
      isMounted = false
    }
  }, [user])

  const isLoading = Boolean(user) && loadedForUid !== user?.uid

  const saveSettings = useCallback(
    async (values: SettingsFormValues): Promise<boolean> => {
      if (!user) return false
      setIsSaving(true)
      setError(null)
      setSuccessMessage(null)
      try {
        if (values.email !== user.email) {
          await updateAccountEmail(user, values.email)
        }
        if (values.password) {
          await updateAccountPassword(user, values.password)
        }
        await saveUserSettings(user.uid, {
          email: values.email,
          notificationsEnabled: values.notificationsEnabled,
        })
        setSuccessMessage('Settings saved successfully.')
        return true
      } catch (err) {
        setError(getAuthErrorMessage(err))
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [user],
  )

  return { initialValues, isLoading, isSaving, error, successMessage, saveSettings }
}
