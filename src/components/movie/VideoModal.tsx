import { useEffect, useRef, useState } from 'react'
import { Button } from '../common/Button'
import { getMovieVideos, findBestTrailer, buildYouTubeEmbedUrl, type TmdbVideoRaw } from '../../services/tmdbService'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  tmdbId: number
  movieTitle: string
}

/** Modal that fetches and plays a movie trailer from TMDB/YouTube. */
export function VideoModal({ isOpen, onClose, tmdbId, movieTitle }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [videoKey, setVideoKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    if (!isOpen) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoKey(null)

    getMovieVideos(tmdbId)
      .then((videos: TmdbVideoRaw[]) => {
        if (!isMountedRef.current) return
        const trailer = findBestTrailer(videos)
        if (trailer) {
          setVideoKey(buildYouTubeEmbedUrl(trailer.key))
        } else {
          setError('No trailer available for this movie.')
        }
      })
      .catch((err: unknown) => {
        if (!isMountedRef.current) return
        setError(err instanceof Error ? err.message : 'Failed to load trailer.')
      })
      .finally(() => {
        if (isMountedRef.current) setIsLoading(false)
      })

    return () => {
      isMountedRef.current = false
    }
  }, [isOpen, tmdbId])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    if (iframeRef.current) {
      iframeRef.current.src = ''
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="bg-gray-900 rounded-lg max-w-3xl w-full overflow-hidden border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 id="video-modal-title" className="text-lg font-semibold text-white">
            {movieTitle} - Trailer
          </h2>
          <Button variant="secondary" onClick={handleClose} aria-label="Close trailer">
            ✕ Close
          </Button>
        </div>

        <div className="aspect-video relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
            </div>
          )}
          {error && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {videoKey && (
            <iframe
              ref={iframeRef}
              src={videoKey}
              title={`${movieTitle} trailer`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  )
}