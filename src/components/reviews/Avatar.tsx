interface AvatarProps {
  src: string
  name: string
}

/** Small circular reviewer profile image with a subtle border. */
export function Avatar({ src, name }: AvatarProps) {
  return (
    <img
      src={src}
      alt={name}
      className="h-7 w-7 shrink-0 rounded-full border border-white/15 object-cover sm:h-8 sm:w-8"
    />
  )
}
