interface PlayButtonProps {
  movieTitle: string
  onPlay: () => void
}

/** Large circular play button that floats over the hero background. */
export function PlayButton({ movieTitle, onPlay }: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play preview of ${movieTitle}`}
      className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] sm:h-24 sm:w-24"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1 text-white">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  )
}