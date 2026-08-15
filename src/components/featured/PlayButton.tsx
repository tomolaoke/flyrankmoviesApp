interface PlayButtonProps {
  label: string
  onPlay: () => void
}

/** Large translucent circular play button centered over the video. */
export function PlayButton({ label, onPlay }: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${label}`}
      className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-20 sm:w-20"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  )
}
