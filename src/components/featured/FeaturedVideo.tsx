import { useRef } from 'react'
import type { FeaturedContent } from '../../constants/featuredContent'
import { PlayButton } from './PlayButton'
import { VideoControls } from './VideoControls'
import { VideoThumbnail } from './VideoThumbnail'

interface FeaturedVideoProps {
  content: FeaturedContent
  onPlay: () => void
}

/** Large cinematic video panel: thumbnail, centered play button, and control bar. */
export function FeaturedVideo({ content, onPlay }: FeaturedVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void container.requestFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video overflow-hidden rounded-lg bg-gray-900"
    >
      <VideoThumbnail src={content.thumbnail} alt={`Featured video: ${content.title}`} />
      {/* Subtle scrim so the play button and controls stay legible */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"
        aria-hidden="true"
      />
      <PlayButton label={content.title} onPlay={onPlay} />
      <VideoControls
        currentTime={content.currentTime}
        duration={content.duration}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  )
}
