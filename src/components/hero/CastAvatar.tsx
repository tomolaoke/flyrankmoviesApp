interface CastAvatarProps {
  name: string
  photo?: string
}

/** Circular cast portrait with a subtle border and first name underneath. */
export function CastAvatar({ name, photo }: CastAvatarProps) {
  const firstName = name.split(' ')[0]

  return (
    <li className="flex w-14 flex-col items-center gap-1">
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="h-11 w-11 rounded-full border border-white/40 object-cover transition-transform duration-200 hover:scale-105"
        />
      ) : (
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm font-semibold text-white"
          role="img"
          aria-label={name}
        >
          {firstName.charAt(0)}
        </div>
      )}
      <span className="truncate text-[11px] text-gray-200 dark:text-gray-300">{firstName}</span>
    </li>
  )
}