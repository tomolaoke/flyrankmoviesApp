import { CastAvatar } from './CastAvatar'

interface CastListProps {
  cast?: { name: string; photo?: string }[]
}

const MAX_VISIBLE = 4

/** Horizontal row of circular cast avatars with a "+ More" button at the end. */
export function CastList({ cast = [] }: CastListProps) {
  const visible = cast.slice(0, MAX_VISIBLE)
  const remaining = cast.length - visible.length

  return (
    <ul className="flex items-end gap-2">
      {visible.map((member) => (
        <CastAvatar key={member.name} name={member.name} photo={member.photo} />
      ))}
      {remaining > 0 && (
        <li className="flex w-14 flex-col items-center gap-1">
          <button
            type="button"
            aria-label={`Show ${remaining} more cast members`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <span className="text-[11px] text-gray-200 dark:text-gray-300">More</span>
        </li>
      )}
    </ul>
  )
}