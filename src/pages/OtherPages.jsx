// ── PLATEAU TECHNIQUE ──────────────────────────────────────
import { Link } from 'react-router-dom'
import { useReveal, revealRef } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
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
  const photos = [
    { label: 'Bâtiment principal',    from: 'from-blue-deep',   to: 'to-blue-mid',    emoji: '🏛️' },
    { label: 'Salle de consultation', from: 'from-teal',        to: 'to-teal-dark',   emoji: '🩺' },
    { label: 'Bloc opératoire',       from: 'from-blue-mid',    to: 'to-blue-bright', emoji: '🔦' },
    { label: 'Laboratoire',           from: 'from-blue-bright', to: 'to-teal',        emoji: '🧪' },
    { label: 'Salle de radiologie',   from: 'from-teal-dark',   to: 'to-blue-deep',   emoji: '📡' },
    { label: "Accueil patients",      from: 'from-blue-deep',   to: 'to-blue-bright', emoji: '👋' },
    { label: 'Pharmacie',             from: 'from-teal',        to: 'to-blue-mid',    emoji: '💊' },
    { label: 'Pavillon chirurgie',    from: 'from-blue-bright', to: 'to-blue-deep',   emoji: '✂️' },
  ]

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
            {photos.map((p, i) => {
              return (
                <div key={p.label} ref={revealRef} className="section-reveal group cursor-pointer" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className={`bg-gradient-to-br ${p.from} ${p.to} rounded-2xl flex flex-col items-center justify-center text-white aspect-square group-hover:scale-105 transition-transform`}>
                    <span className="text-5xl mb-3">{p.emoji}</span>
                    <span className="text-xs font-medium text-white/80 px-3 text-center">{p.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-12 text-center bg-white rounded-2xl p-8 border border-dashed border-slate-300">
            <p className="text-4xl mb-3">📸</p>
            <h3 className="font-bold text-blue-deep mb-2">Photos réelles à venir</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Remplacez ces visuels par les vraies photos de la clinique. Formats recommandés : JPG/WebP, 800×600px minimum.
            </p>
          </div>
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

// ── RDV ────────────────────────────────────────────────────
import { useState } from 'react'

export function RDV() {
  const heroRef = useReveal()
  const [form, setForm] = useState({ prenom: '', nom: '', tel: '', email: '', service: '', date: '', motif: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.prenom || !form.nom || !form.tel || !form.service || !form.date) {
      setError('Veuillez remplir tous les champs obligatoires (*).')
      return
    }
    setError('')
    const subject = encodeURIComponent(`RDV – ${form.prenom} ${form.nom} – ${form.service}`)
    const body = encodeURIComponent(
      `Demande de rendez-vous\n\n` +
      `Nom complet : ${form.prenom} ${form.nom}\n` +
      `Téléphone   : ${form.tel}\n` +
      `Email       : ${form.email || 'Non fourni'}\n` +
      `Service     : ${form.service}\n` +
      `Date souhait: ${form.date}\n\n` +
      `Motif       :\n${form.motif || 'Non précisé'}`
    )
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={heroRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">En ligne, simple et rapide</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Prendre un rendez-vous</h1>
            <p className="text-white/75 text-lg">Remplissez le formulaire ci-dessous. Notre équipe vous confirmera votre RDV dans les 24h.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          {sent ? (
            <div className="text-center bg-white rounded-2xl p-14 border border-teal/30 shadow-lg">
              <div className="text-7xl mb-5">✅</div>
              <h2 className="font-display text-3xl text-blue-deep mb-3">Demande envoyée !</h2>
              <p className="text-slate-500 mb-8">Votre client email va s'ouvrir. Si ce n'est pas le cas, contactez-nous directement au <a href={`tel:${CONTACT.tel1Raw}`} className="text-teal font-semibold">{CONTACT.tel1}</a>.</p>
              <button onClick={() => { setSent(false); setForm({ prenom: '', nom: '', tel: '', email: '', service: '', date: '', motif: '' }) }}
                className="px-6 py-3 border-2 border-blue-bright text-blue-bright rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 className="font-display text-2xl text-blue-deep mb-7">📅 Réserver une consultation</h2>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {[['prenom', 'Prénom *', 'text', 'Jean'], ['nom', 'Nom *', 'text', 'Kabila']].map(([name, label, type, ph]) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handle} placeholder={ph}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Téléphone *</label>
                  <input type="tel" name="tel" value={form.tel} onChange={handle} placeholder="+243 8XX XXX XXX"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handle} placeholder="votre@email.com"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service souhaité *</label>
                  <select name="service" value={form.service} onChange={handle}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors bg-white">
                    <option value="">Choisir un service</option>
                    {['Consultations externes', 'Médecine interne', 'Chirurgie', 'Imagerie médicale (Scanner, Radio, Écho)', 'Urgences', 'Laboratoire'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date souhaitée *</label>
                  <input type="date" name="date" value={form.date} onChange={handle} min={today}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors" />
                </div>
              </div>

              <div className="mb-7">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Motif de consultation</label>
                <textarea name="motif" value={form.motif} onChange={handle} rows={4} placeholder="Décrivez brièvement votre motif de consultation..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors resize-none" />
              </div>

              <button type="submit" className="w-full py-4 bg-teal hover:bg-teal-dark text-white font-bold text-base rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2">
                ✉️ Envoyer ma demande de RDV
              </button>
              <p className="text-xs text-slate-400 text-center mt-4">
                En cliquant, votre client email s'ouvrira avec les informations pré-remplies.
              </p>
            </form>
          )}

          {/* Contact rapide */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href={`tel:${CONTACT.tel1Raw}`} className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:border-teal hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-teal-light rounded-xl flex items-center justify-center text-2xl">📞</div>
              <div>
                <span className="text-xs text-slate-400 block">Appel direct</span>
                <span className="font-bold text-blue-deep group-hover:text-teal transition-colors">{CONTACT.tel1}</span>
              </div>
            </a>
            <a href={`tel:${CONTACT.tel2Raw}`} className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:border-teal hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📞</div>
              <div>
                <span className="text-xs text-slate-400 block">Ligne secondaire</span>
                <span className="font-bold text-blue-deep group-hover:text-teal transition-colors">{CONTACT.tel2}</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
