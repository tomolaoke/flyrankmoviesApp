import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

interface VideoControlsProps {
  currentTime: string
  duration: string
  onToggleFullscreen: () => void
}

function parseTime(value: string): number {
  const parts = value.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Subtle custom player controls overlaid on the bottom of the video:
 * current time, an interactive seek bar, duration, and player icons.
 * Built as a mock now, but laid out so real video wiring can swap in.
 */
export function VideoControls({ currentTime, duration, onToggleFullscreen }: VideoControlsProps) {
  const durationSeconds = Math.max(1, parseTime(duration))
  const [currentSeconds, setCurrentSeconds] = useState(() => parseTime(currentTime))
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const seekFromClientX = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    setCurrentSeconds(Math.round(ratio * durationSeconds))
  }

  const percentage = Math.min(100, Math.max(0, (currentSeconds / durationSeconds) * 100))

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    seekFromClientX(event.clientX)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    seekFromClientX(event.clientX)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setCurrentSeconds((seconds) => Math.min(durationSeconds, seconds + 5))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setCurrentSeconds((seconds) => Math.max(0, seconds - 5))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setCurrentSeconds(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setCurrentSeconds(durationSeconds)
    }
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-3 pt-12">
      <span className="shrink-0 text-xs font-medium tabular-nums text-white/90">
        {formatTime(currentSeconds)}
      </span>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Seek position"
        aria-valuemin={0}
        aria-valuemax={durationSeconds}
        aria-valuenow={currentSeconds}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="pointer-events-auto group flex flex-1 cursor-pointer touch-none items-center py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <div className="relative h-1 w-full rounded-full bg-white/25">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/90 transition-[width] duration-150"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>

      <span className="shrink-0 text-xs font-medium tabular-nums text-white/90">{duration}</span>

      <button
        type="button"
        aria-label="Playback settings"
        className="pointer-events-auto shrink-0 rounded-md p-1 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.61 3.61 0 0 1 8.4 12 3.61 3.61 0 0 1 12 8.4a3.61 3.61 0 0 1 3.6 3.6 3.61 3.61 0 0 1-3.6 3.6z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label="Toggle fullscreen"
        className="pointer-events-auto shrink-0 rounded-md p-1 text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
      </button>
    </div>
  )
}
