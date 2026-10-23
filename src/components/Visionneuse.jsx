import { useEffect, useRef } from 'react'

// Affichage plein écran d'une photo de la galerie, avec navigation (flèches, clavier, balayage).
export default function Visionneuse({ photos, index, changer, fermer }) {
  const photo = photos[index]
  const precedente = () => changer((index - 1 + photos.length) % photos.length)
  const suivante = () => changer((index + 1) % photos.length)

  useEffect(() => {
    const clavier = (e) => {
      if (e.key === 'Escape') fermer()
      if (e.key === 'ArrowLeft') changer((index - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') changer((index + 1) % photos.length)
    }
    const ancien = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', clavier)
    return () => { window.removeEventListener('keydown', clavier); document.body.style.overflow = ancien }
  }, [index, photos.length, changer, fermer])

  const debutX = useRef(null)
  return (
    <div role="dialog" aria-modal="true" aria-label={photo.legende || 'Photo'} className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
      onTouchStart={(e) => { debutX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (debutX.current === null) return
        const dx = e.changedTouches[0].clientX - debutX.current
        if (Math.abs(dx) > 50) (dx > 0 ? precedente : suivante)()
        debutX.current = null
      }}>
      <div className="flex items-center justify-between p-4 text-white/80 text-sm">
        <span>{index + 1} / {photos.length}</span>
        <button onClick={fermer} aria-label="Fermer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-xl">✕</button>
      </div>
      <div className="flex-1 flex items-center justify-center px-2 min-h-0" onClick={fermer}>
        <img src={photo.url} alt={photo.legende} onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-lg" />
      </div>
      <div className="flex items-center justify-between gap-4 p-4">
        <button onClick={precedente} aria-label="Photo précédente" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl">‹</button>
        <p className="text-white text-center font-medium">{photo.legende}</p>
        <button onClick={suivante} aria-label="Photo suivante" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl">›</button>
      </div>
    </div>
  )
}
