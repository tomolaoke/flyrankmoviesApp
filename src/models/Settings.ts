/** User-editable account settings, persisted to Firestore per-user. */
export interface UserSettings {
  email: string
  notificationsEnabled: boolean
}
