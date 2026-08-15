interface VideoThumbnailProps {
  src: string
  alt: string
}

/** Full-bleed cinematic image behind the featured video player. */
export function VideoThumbnail({ src, alt }: VideoThumbnailProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
    />
  )
}
