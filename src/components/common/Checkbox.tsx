import { forwardRef, useId, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/** Labeled checkbox with the same ref-forwarding/accessibility conventions as `Input`. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, id, className = '', ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500 bg-white dark:border-gray-600 dark:bg-gray-700 ${className}`}
          {...rest}
        />
        <label htmlFor={inputId} className="text-sm font-medium text-gray-800 dark:text-gray-300">
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
})