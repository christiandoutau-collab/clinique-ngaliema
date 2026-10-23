// ── PLATEAU TECHNIQUE ──────────────────────────────────────
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, revealRef } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import { chargerPhotos } from '../lib/galerie'
import { CATEGORIES_GALERIE } from '../data/galerie'
import { PLATEAU_ITEMS } from '../data/content'

export function Plateau() {
  const heroRef = useReveal()
  return (
    <>
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={heroRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Équipements modernes</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Plateau technique</h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Des équipements médicaux de pointe pour un diagnostic précis et des soins de qualité,
              au service de chaque patient.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            label="Nos équipements"
            title="Un plateau technique complet"
            desc="La Clinique Ngaliema dispose d'un plateau technique moderne avec système numérique pour un diagnostic de précision."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATEAU_ITEMS.map((item, i) => {
              return (
                <div key={item.label} ref={revealRef} className="section-reveal flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:border-teal hover:shadow-lg transition-all hover:-translate-y-1" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="w-12 h-12 bg-teal-light rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{item.emoji}</div>
                  <span className="font-medium text-blue-deep">{item.label}</span>
                </div>
              )
            })}
          </div>

          {/* Info block */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '📡', title: 'Imagerie numérique', desc: "Système d'imagerie médicale numérique de dernière génération pour un diagnostic précis et rapide." },
              { emoji: '🧪', title: 'Laboratoire', desc: "Laboratoire d'analyses biologiques complet avec résultats rapides pour orienter le diagnostic médical." },
              { emoji: '✂️', title: 'Bloc opératoire', desc: "Bloc opératoire équipé aux standards internationaux pour les interventions chirurgicales programmées et urgentes." },
            ].map((item) => {
              return (
                <div key={item.title} ref={revealRef} className="section-reveal text-center bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-md transition-all">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-bold text-blue-deep text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-teal text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-display text-2xl mb-3">Besoin d'un examen médical ?</h2>
          <p className="text-white/80 mb-6">Prenez rendez-vous avec notre équipe pour accéder à notre plateau technique.</p>
          <Link to="/rdv" className="bg-white text-teal font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-all inline-flex items-center gap-2">
            📅 Prendre un rendez-vous
          </Link>
        </div>
      </section>
    </>
  )
}

// ── NOUVELLES ──────────────────────────────────────────────
import { NEWS } from '../data/content'

export function Nouvelles() {
  const heroRef = useReveal()
  const catColors = { 'Équipement': 'bg-teal-light text-teal', 'Événement': 'bg-blue-50 text-blue-bright', 'Personnel': 'bg-amber-50 text-amber-700' }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={heroRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Restez informé</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Actualités</h1>
            <p className="text-white/75 text-lg">Les dernières nouvelles de la Clinique Ngaliema.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEWS.map((news, i) => {
              return (
                <article key={news.id} ref={revealRef} className="section-reveal bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="h-40 bg-gradient-to-br from-blue-deep to-blue-bright flex items-center justify-center text-5xl">
                    {news.category === 'Équipement' ? '🔬' : news.category === 'Événement' ? '📅' : '👨‍⚕️'}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColors[news.category]}`}>{news.category}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(news.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-bold text-blue-deep text-lg leading-snug mb-3">{news.title}</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">{news.excerpt}</p>
                    <button className="mt-5 text-sm font-semibold text-blue-bright hover:text-teal transition-colors flex items-center gap-1">
                      Lire la suite →
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="text-center mt-12 py-10 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-4xl mb-3">📰</p>
            <h3 className="font-bold text-blue-deep mb-2">D'autres actualités à venir</h3>
            <p className="text-slate-400 text-sm">Revenez régulièrement pour suivre les dernières nouvelles de la clinique.</p>
          </div>
        </div>
      </section>
    </>
  )
}

// ── GALERIE ────────────────────────────────────────────────
export function Galerie() {
  const heroRef = useReveal()
  const [photos, setPhotos] = useState(null) // null = chargement

  // Photos publiées par le personnel ; en cas d'échec, les tuiles gardent leur visuel par défaut
  useEffect(() => {
    chargerPhotos().then(setPhotos).catch(() => setPhotos([]))
  }, [])

  // Pour chaque catégorie : nombre de photos et photo la plus récente (la liste arrive triée)
  const parCategorie = (id) => {
    const liste = photos?.filter((p) => p.categorie === id) ?? []
    return { nombre: liste.length, couverture: liste[0] }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={heroRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Visite virtuelle</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Galerie photos</h1>
            <p className="text-white/75 text-lg">Découvrez nos installations et notre environnement de soins.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader label="Nos installations" title="La Clinique Ngaliema en images" center />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES_GALERIE.map((c, i) => {
              const { nombre, couverture } = parCategorie(c.id)
              return (
                <Link key={c.id} to={`/galerie/${c.id}`} ref={revealRef} style={{ transitionDelay: `${i * 60}ms` }}
                  className="section-reveal group relative block aspect-square rounded-2xl overflow-hidden">
                  {couverture ? (
                    <>
                      <img src={couverture.url} alt={c.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <span className="block font-semibold text-sm sm:text-base leading-tight">{c.label}</span>
                        <span className="block text-xs text-white/75 mt-0.5">{nombre} photo{nombre > 1 ? 's' : ''} →</span>
                      </span>
                    </>
                  ) : (
                    <span className={`absolute inset-0 bg-gradient-to-br ${c.from} ${c.to} flex flex-col items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                      <span className="text-5xl mb-3">{c.emoji}</span>
                      <span className="text-xs sm:text-sm font-medium text-white/90 px-3 text-center">{c.label}</span>
                      <span className="text-[11px] text-white/60 mt-1">Découvrir →</span>
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          <p className="mt-10 text-center">
            <Link to="/galerie/gerer" className="text-xs font-semibold text-slate-400 hover:text-teal">📷 Gérer les photos (personnel)</Link>
          </p>
        </div>
      </section>
    </>
  )
}

// ── CONTACTS ───────────────────────────────────────────────
import { CONTACT } from '../data/content'

export function Contacts() {
  const heroRef = useReveal()
  const infoRef = useReveal()

  return (
    <>
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={heroRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Nous contacter</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Contacts</h1>
            <p className="text-white/75 text-lg">Notre équipe est disponible pour répondre à toutes vos questions.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={infoRef} className="section-reveal grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {[
              { emoji: '📞', label: 'Téléphones', lines: [CONTACT.tel1, CONTACT.tel2], hrefs: [`tel:${CONTACT.tel1Raw}`, `tel:${CONTACT.tel2Raw}`] },
              { emoji: '✉️', label: 'Email',      lines: [CONTACT.email], hrefs: [`mailto:${CONTACT.email}`] },
              { emoji: '📍', label: 'Adresse',    lines: [CONTACT.addressLine1, CONTACT.addressLine2, CONTACT.addressLine3], hrefs: [CONTACT.maps] },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-lg transition-all text-center">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-bold text-blue-deep mb-3">{item.label}</h3>
                {item.lines.map((line, i) => (
                  <a key={i} href={item.hrefs[i] || item.hrefs[0]} target={item.hrefs[0].startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    className="block text-slate-500 hover:text-teal transition-colors text-sm mb-1">
                    {line}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100">
              <h3 className="font-bold text-blue-deep text-xl mb-5">🕐 Horaires d'ouverture</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <span className="font-bold text-red-600">🚨 Urgences</span>
                  <span className="block text-sm text-red-500 mt-0.5">24 heures sur 24, 7 jours sur 7</span>
                </div>
                {[
                  ['Consultations externes', 'Lun – Ven', '8h00 – 15h30'],
                  ['Médecine interne',       'Lun – Ven', '8h00 – 15h00'],
                  ['Imagerie médicale',      'Lun – Ven', '8h00 – 15h00'],
                ].map(([s, d, t]) => (
                  <div key={s} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
                    <span className="text-slate-600">{s}</span>
                    <div className="text-right">
                      <span className="block text-xs text-slate-400">{d}</span>
                      <span className="font-bold text-teal">{t}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <a href={CONTACT.maps} target="_blank" rel="noreferrer" className="block">
                <div className="bg-gradient-to-br from-blue-deep to-blue-mid rounded-2xl h-full min-h-56 flex flex-col items-center justify-center text-white text-center p-8 hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-6xl mb-4">📍</span>
                  <h3 className="font-bold text-xl mb-2">Voir sur Google Maps</h3>
                  <p className="text-white/70 text-sm">{CONTACT.addressLine1}</p>
                  <p className="text-white/70 text-sm">{CONTACT.addressLine2}</p>
                  <span className="mt-4 px-5 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    Ouvrir Maps →
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/rdv" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl">
              📅 Prendre un rendez-vous en ligne
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
