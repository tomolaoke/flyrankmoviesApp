/** Inline error banner, announced immediately to assistive tech via `role="alert"`. */
export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300"
    >
      {message}
    </p>
  )
}