interface HeroBackgroundProps {
  backdrop?: string
}

/** Edge-to-edge backdrop image with layered cinematic overlays (dark left, faded bottom). */
export function HeroBackground({ backdrop }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {backdrop ? (
        <img src={backdrop} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      )}
      {/* Overall darkening */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Left-to-right darkening so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      {/* Bottom fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900" />
    </div>
  )
}