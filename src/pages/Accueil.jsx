import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import { CONTACT, SERVICES, STATS, NEWS } from '../data/content'

const colorMap = {
  blue: 'bg-blue-50 border-blue-100 hover:border-blue-bright',
  teal: 'bg-teal-light border-teal/20 hover:border-teal',
  gold: 'bg-amber-50 border-amber-100 hover:border-amber-400',
  red:  'bg-red-50 border-red-100 hover:border-red-400',
}
const iconBg = {
  blue: 'bg-blue-100',
  teal: 'bg-teal-light',
  gold: 'bg-amber-100',
  red:  'bg-red-100',
}

function ServiceCard({ service, delay = 0 }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`section-reveal p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${colorMap[service.color]}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 rounded-xl ${iconBg[service.color]} flex items-center justify-center text-2xl mb-5`}>
        {service.emoji}
      </div>
      <h3 className="font-bold text-blue-deep text-lg mb-3">{service.title}</h3>
      <ul className="space-y-1.5">
        {service.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
            <span className="text-teal font-bold mt-0.5 flex-shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <Link to="/services" className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-blue-bright hover:text-teal transition-colors">
        En savoir plus →
      </Link>
    </div>
  )
}

function NewsCard({ news }) {
  const ref = useReveal()
  const catColors = { 'Équipement': 'bg-teal-light text-teal', 'Événement': 'bg-blue-50 text-blue-bright', 'Personnel': 'bg-amber-50 text-amber-700' }
  return (
    <div ref={ref} className="section-reveal bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="h-32 bg-gradient-to-br from-blue-deep to-blue-bright flex items-center justify-center text-4xl">
        {news.category === 'Équipement' ? '🔬' : news.category === 'Événement' ? '📅' : '👨‍⚕️'}
      </div>
      <div className="p-5">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${catColors[news.category] || 'bg-slate-100 text-slate-500'}`}>
          {news.category}
        </span>
        <p className="text-xs text-slate-400 mt-2">
          {new Date(news.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h3 className="font-bold text-blue-deep mt-2 mb-2 leading-snug">{news.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{news.excerpt}</p>
      </div>
    </div>
  )
}

export default function Accueil() {
  const heroRef = useReveal()
  const visionRef = useReveal()

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-blue-deep via-blue-mid to-blue-bright text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={heroRef} className="section-reveal">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot" />
                Urgences ouvertes 24h/24
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-5">
                Votre santé,<br />
                <span className="text-teal">notre priorité</span><br />
                depuis 1927
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
                Clinique Ngaliema, institution de référence à Kinshasa. Une équipe médicale
                professionnelle à votre service pour des soins de qualité accessibles à tous.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/rdv" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  📅 Prendre un RDV
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 backdrop-blur-sm">
                  Nos services →
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/15">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <span className="block font-display text-2xl md:text-3xl text-teal">{s.num}</span>
                    <span className="text-xs text-white/55 mt-0.5 block leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-7 backdrop-blur-md">
                <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">🕐 Horaires d'ouverture</h3>
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-red-300 block mb-1">🚨 Urgences</span>
                  <span className="font-bold text-lg">Ouvert 24 heures sur 24, 7j/7</span>
                </div>
                {[
                  ['Consultations externes', '8h00 – 15h30'],
                  ['Lundi – Vendredi', 'Ouvert'],
                  ['Samedi – Dimanche', 'Urgences seulement'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-3 border-b border-white/10 text-white/75 last:border-0">
                    <span>{k}</span><strong className="text-white">{v}</strong>
                  </div>
                ))}
                <a href={`tel:${CONTACT.tel1Raw}`} className="flex items-center gap-3 mt-5 bg-white/10 hover:bg-white/20 rounded-xl p-3.5 transition-colors group">
                  <span className="text-2xl">📞</span>
                  <div>
                    <span className="block text-xs text-white/60">Appeler maintenant</span>
                    <span className="font-bold text-white group-hover:text-teal transition-colors">{CONTACT.tel1}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            label="Ce que nous offrons"
            title="Services organisés"
            desc="Une offre de soins complète pour répondre aux besoins de santé de tous les habitants de Kinshasa et au-delà."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => <ServiceCard key={s.id} service={s} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ── VISION BAND ── */}
      <section className="py-20 bg-gradient-to-br from-blue-deep to-blue-mid text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={visionRef} className="section-reveal grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Notre engagement</p>
              <blockquote className="font-display text-3xl md:text-4xl leading-tight mb-6">
                "<span className="text-teal">Tout satisfaire</span><br />
                et<br />
                <span className="text-teal">Tous satisfaire</span>"
              </blockquote>
              <div className="flex items-center gap-4 mt-6">
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-center">
                  <span className="block font-display text-2xl text-teal">1927</span>
                  <span className="text-xs text-white/60">Fondée en</span>
                </div>
                <p className="text-sm text-white/65 leading-relaxed">
                  Institution de soins de santé publique, la Clinique Ngaliema se met à la disposition
                  des habitants de Kinshasa depuis près d'un siècle.
                </p>
              </div>
            </div>
            <div>
              <p className="text-white/70 leading-relaxed mb-4">
                Avoir une vision est indispensable car elle sert de référence et permet de se diriger
                dans une direction bien précise dans la démarche vers les objectifs.
              </p>
              <p className="text-white/70 leading-relaxed">
                La Clinique Ngaliema s'engage à offrir des soins de qualité, accessibles et humains
                à chaque patient qui franchit ses portes. Disponibilité et Soins de Qualité — un service
                public au cœur de Kinshasa depuis près d'un siècle.
              </p>
              <Link to="/presentation" className="inline-flex items-center gap-2 mt-6 text-teal font-semibold hover:text-white transition-colors">
                En savoir plus sur notre histoire →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTUALITÉS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            label="Actualités"
            title="Dernières nouvelles"
            desc="Restez informé des dernières actualités et événements de la Clinique Ngaliema."
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/nouvelles" className="inline-flex items-center gap-2 border-2 border-blue-bright text-blue-bright hover:bg-blue-bright hover:text-white font-semibold px-6 py-3 rounded-xl transition-all">
              Voir toutes les nouvelles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA RDV ── */}
      <section className="py-16 bg-teal text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">Prêt à prendre soin de vous ?</h2>
          <p className="text-white/80 text-lg mb-8">
            Réservez votre consultation en ligne. Notre équipe vous confirmera votre RDV rapidement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/rdv" className="bg-white text-teal font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-xl">
              📅 Prendre un rendez-vous
            </Link>
            <a href={`tel:${CONTACT.tel1Raw}`} className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
              📞 Nous appeler
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
