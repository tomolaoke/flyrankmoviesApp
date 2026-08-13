import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../common/Button'
import { Checkbox } from '../common/Checkbox'
import { ErrorMessage } from '../common/ErrorMessage'
import { Input } from '../common/Input'
import {
  settingsSchema,
  type SettingsFormValues,
} from '../../schemas/settingsSchema'

export interface SettingsFormProps {
  defaultValues: SettingsFormValues
  onSubmit: (values: SettingsFormValues) => void | Promise<void>
  isSubmitting?: boolean
  submitError?: string | null
  submitSuccess?: string | null
}

/**
 * Account settings form: email, password (optional change), and a
 * notification preference toggle. Pure/presentational — validation
 * logic lives in `schemas/settingsSchema`, persistence lives in
 * `useSettingsViewModel`. Kept standalone so it can be unit tested
 * without mocking Firebase.
 *
 * Validation mode is 'onTouched' + revalidate 'onChange': a field's
 * error only appears once the user has blurred it (or submitted the
 * form), and then updates live as they keep typing — satisfying the
 * "errors after touch or submit" accessibility requirement.
 */
export function SettingsForm({ defaultValues, onSubmit, isSubmitting = false, submitError, submitSuccess }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues,
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
      aria-label="Account settings"
      className="flex flex-col gap-4"
    >
      {submitError && <ErrorMessage message={submitError} />}
      {submitSuccess && (
        <p role="status" className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {submitSuccess}
        </p>
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="Leave blank to keep current password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Checkbox
        label="Email me about notifications"
        error={errors.notificationsEnabled?.message}
        {...register('notificationsEnabled')}
      />

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Save settings
      </Button>
    </form>
  )
}
