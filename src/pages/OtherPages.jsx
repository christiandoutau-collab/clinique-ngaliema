// ── PLATEAU TECHNIQUE ──────────────────────────────────────
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, revealRef } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import Visionneuse from '../components/Visionneuse'
import { chargerPhotos } from '../lib/galerie'
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
const VISUELS_PROVISOIRES = [
  { label: 'Bâtiment principal',    from: 'from-blue-deep',   to: 'to-blue-mid',    emoji: '🏛️' },
  { label: 'Salle de consultation', from: 'from-teal',        to: 'to-teal-dark',   emoji: '🩺' },
  { label: 'Bloc opératoire',       from: 'from-blue-mid',    to: 'to-blue-bright', emoji: '🔦' },
  { label: 'Laboratoire',           from: 'from-blue-bright', to: 'to-teal',        emoji: '🧪' },
  { label: 'Salle de radiologie',   from: 'from-teal-dark',   to: 'to-blue-deep',   emoji: '📡' },
  { label: "Accueil patients",      from: 'from-blue-deep',   to: 'to-blue-bright', emoji: '👋' },
  { label: 'Pharmacie',             from: 'from-teal',        to: 'to-blue-mid',    emoji: '💊' },
  { label: 'Pavillon chirurgie',    from: 'from-blue-bright', to: 'to-blue-deep',   emoji: '✂️' },
]

export function Galerie() {
  const heroRef = useReveal()
  const [photos, setPhotos] = useState(null) // null = chargement
  const [ouverte, setOuverte] = useState(null)
  const fermer = useCallback(() => setOuverte(null), [])

  // Photos publiées par le personnel ; en cas d'échec, on garde les visuels provisoires
  useEffect(() => {
    chargerPhotos().then(setPhotos).catch(() => setPhotos([]))
  }, [])

  const reelles = photos?.length > 0

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

          {photos === null && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true">
              {Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-square rounded-2xl bg-slate-200 animate-pulse" />)}
            </div>
          )}

          {reelles && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((p, i) => (
                <button key={p.url} onClick={() => setOuverte(i)} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 text-left">
                  <img src={p.url} alt={p.legende || 'Photo de la clinique'} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.legende && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm font-medium px-3 pt-8 pb-2.5">{p.legende}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {photos?.length === 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {VISUELS_PROVISOIRES.map((p, i) => (
                  <div key={p.label} ref={revealRef} className="section-reveal group" style={{ transitionDelay: `${i * 60}ms` }}>
                    <div className={`bg-gradient-to-br ${p.from} ${p.to} rounded-2xl flex flex-col items-center justify-center text-white aspect-square group-hover:scale-105 transition-transform`}>
                      <span className="text-5xl mb-3">{p.emoji}</span>
                      <span className="text-xs font-medium text-white/80 px-3 text-center">{p.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center bg-white rounded-2xl p-8 border border-dashed border-slate-300">
                <p className="text-4xl mb-3">📸</p>
                <h3 className="font-bold text-blue-deep mb-2">Photos réelles à venir</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Les photos de la clinique seront bientôt publiées ici.
                </p>
                <Link to="/personnel" className="inline-block mt-4 text-sm font-semibold text-teal hover:text-teal-dark">
                  Personnel : ajouter des photos →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {reelles && ouverte !== null && <Visionneuse photos={photos} index={ouverte} changer={setOuverte} fermer={fermer} />}
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
