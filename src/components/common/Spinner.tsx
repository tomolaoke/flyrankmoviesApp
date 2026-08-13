/** Accessible loading indicator: visually a spinner, announced to screen readers as "Loading". */
export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-8 text-gray-500">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" aria-hidden="true" />
      <span>{label}...</span>
    </div>
  )
}
