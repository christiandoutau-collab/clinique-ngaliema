import { useEffect, useRef } from 'react'

const OPTIONS = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      OPTIONS
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return ref
}

// Variante « callback ref » utilisable dans un .map() (les hooks y sont interdits)
export function revealRef(el) {
  if (!el) return
  const obs = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
    OPTIONS
  )
  obs.observe(el)
  return () => obs.disconnect()
}
