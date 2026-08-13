/**
 * Validation schema for the Settings form, shared between
 * react-hook-form's resolver and the inferred TypeScript type below.
 * Password is optional: leaving it blank means "keep current password".
 */
import { z } from 'zod'

export const settingsSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .refine((val) => val.length === 0 || val.length >= 6, {
        message: 'Password must be at least 6 characters',
      }),
    confirmPassword: z.string(),
    notificationsEnabled: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SettingsFormValues = z.infer<typeof settingsSchema>

export const settingsDefaultValues: SettingsFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  notificationsEnabled: false,
}
