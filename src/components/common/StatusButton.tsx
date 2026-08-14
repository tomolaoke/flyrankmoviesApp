import type { ButtonHTMLAttributes } from 'react'

interface StatusButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  status: 'ok' | 'warning' | 'error'
  label: string
}

const STATUS_STYLES: Record<StatusButtonProps['status'], string> = {
  ok: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60',
  warning:
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:hover:bg-yellow-900/60',
  error: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60',
}

const STATUS_ICON: Record<StatusButtonProps['status'], string> = {
  ok: '✅',
  warning: '⚠️',
  error: '❌',
}

/** Button styled as a colored pill used to show pass/warn/fail results on the health-check page. */
export function StatusButton({ status, label, className = '', children, ...rest }: StatusButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${STATUS_STYLES[status]} ${className}`}
      {...rest}
    >
      <span aria-hidden="true">{STATUS_ICON[status]}</span>
      {label}
      {children}
    </button>
  )
}