import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import { SERVICES } from '../data/content'

const colorBorder = { blue: 'border-blue-bright', teal: 'border-teal', gold: 'border-amber-400', red: 'border-red-400' }
const colorBg    = { blue: 'bg-blue-50',  teal: 'bg-teal-light', gold: 'bg-amber-50', red: 'bg-red-50' }
const colorText  = { blue: 'text-blue-bright', teal: 'text-teal', gold: 'text-amber-600', red: 'text-red-500' }

function ServiceDetail({ service, reverse = false }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`section-reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      {/* Visual */}
      <div className={`${reverse ? 'lg:col-start-2' : ''}`}>
        <div className={`rounded-2xl p-10 ${colorBg[service.color]} border-2 ${colorBorder[service.color]} flex flex-col items-center justify-center text-center min-h-56`}>
          <span className="text-7xl mb-4">{service.emoji}</span>
          <h3 className={`font-bold text-xl ${colorText[service.color]}`}>{service.title}</h3>
        </div>
      </div>
      {/* Content */}
      <div className={reverse ? 'lg:col-start-1 lg:row-start-1' : ''}>
        <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${colorText[service.color]}`}>Service</p>
        <h2 className="font-display text-3xl text-blue-deep mb-4">{service.title}</h2>
        <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
        <ul className="space-y-3">
          {service.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${colorBg[service.color]} ${colorText[service.color]} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>✓</span>
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
        <Link to="/rdv" className={`inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${service.color === 'teal' ? 'bg-teal hover:bg-teal-dark' : 'bg-blue-bright hover:bg-blue-mid'}`}>
          📅 Prendre rendez-vous
        </Link>
      </div>
    </div>
  )
}

export default function Services() {
  const heroRef = useReveal()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={heroRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Notre offre de soins</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Nos services</h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Une offre médicale complète pour répondre à tous vos besoins de santé,
              avec une équipe qualifiée et des équipements modernes.
            </p>
          </div>
        </div>
      </section>

      {/* Cards rapides */}
      <section className="bg-white py-10 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`flex items-center gap-3 p-4 rounded-xl ${colorBg[s.color]} border-2 ${colorBorder[s.color]} hover:-translate-y-1 transition-all`}>
                <span className="text-2xl">{s.emoji}</span>
                <span className={`font-semibold text-sm ${colorText[s.color]}`}>{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services détaillés */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          {SERVICES.map((s, i) => (
            <div key={s.id} id={s.id}>
              <ServiceDetail service={s} reverse={i % 2 !== 0} />
            </div>
          ))}
        </div>
      </section>

      {/* Horaires */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader label="Horaires" title="Quand nous consulter ?" center />
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
            <div className="bg-red-500 text-white p-5 flex items-center gap-4">
              <span className="text-3xl">🚨</span>
              <div>
                <span className="font-bold text-lg block">Service des urgences</span>
                <span className="text-red-100">Ouvert 24 heures sur 24, 7 jours sur 7</span>
              </div>
            </div>
            {[
              ['Consultations externes', 'Lundi – Vendredi', '8h00 – 15h30'],
              ['Médecine interne',       'Lundi – Vendredi', '8h00 – 15h00'],
              ['Imagerie médicale',      'Lundi – Vendredi', '8h00 – 15h00'],
              ['Chirurgie programmée',   'Sur rendez-vous',  'À définir'],
            ].map(([svc, day, time]) => (
              <div key={svc} className="flex items-center justify-between px-6 py-4 border-b border-slate-200 last:border-0">
                <span className="font-medium text-blue-deep">{svc}</span>
                <div className="text-right">
                  <span className="block text-xs text-slate-400">{day}</span>
                  <span className="font-bold text-teal">{time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/rdv" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl">
              📅 Réserver ma consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
