import { SettingsForm } from '../components/settings/SettingsForm'
import { Spinner } from '../components/common/Spinner'
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel'

/** Protected page for editing account email, password, and notification preferences. */
export function SettingsPage() {
  const { initialValues, isLoading, isSaving, error, successMessage, saveSettings } = useSettingsViewModel()

  if (isLoading || !initialValues) {
    return <Spinner label="Loading settings" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your email, password, and notification preferences.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <SettingsForm
            defaultValues={{
              email: initialValues.email,
              password: '',
              confirmPassword: '',
              notificationsEnabled: initialValues.notificationsEnabled,
            }}
            onSubmit={async (values) => {
              await saveSettings(values)
            }}
            isSubmitting={isSaving}
            submitError={error}
            submitSuccess={successMessage}
          />
        </div>
      </div>
    </div>
  )
}