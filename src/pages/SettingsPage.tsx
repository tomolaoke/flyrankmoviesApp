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
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Update your email, password, and notification preferences.</p>
      </div>
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
  )
}
