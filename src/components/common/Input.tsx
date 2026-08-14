import { forwardRef, useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/**
 * Labeled text input with accessible error messaging.
 * Forwards its ref so it can be registered directly with react-hook-form
 * (e.g. `<Input {...register('email')} />`).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-800 dark:text-gray-300">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-md border px-3 py-2 text-sm shadow-sm bg-white border-gray-300 text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
          dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
          ${error ? 'border-red-500' : ''} ${className}`}
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
})