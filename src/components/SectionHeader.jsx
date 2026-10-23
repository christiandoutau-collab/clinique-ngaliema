import { useReveal } from '../hooks/useReveal'

export default function SectionHeader({ label, title, desc, center = false }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`section-reveal mb-10 ${center ? 'text-center' : ''}`}>
      {label && (
        <p className="text-xs font-bold tracking-widest uppercase text-teal mb-2">{label}</p>
      )}
      <h2 className="font-display text-3xl md:text-4xl text-blue-deep mb-3">{title}</h2>
      {desc && (
        <p className={`text-slate-500 text-base leading-relaxed ${center ? 'mx-auto max-w-xl' : 'max-w-xl'}`}>
          {desc}
        </p>
      )}
    </div>
  )
}
