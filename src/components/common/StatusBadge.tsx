interface StatusBadgeProps {
  status: 'ok' | 'warning' | 'error'
  label: string
}

const STATUS_STYLES: Record<StatusBadgeProps['status'], string> = {
  ok: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
}

const STATUS_ICON: Record<StatusBadgeProps['status'], string> = {
  ok: '✅',
  warning: '⚠️',
  error: '❌',
}

/** Small colored pill used to show pass/warn/fail results on the health-check page. */
export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      <span aria-hidden="true">{STATUS_ICON[status]}</span>
      {label}
    </span>
  )
}
