import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useClinique } from '../hooks/useClinique'
import { CONTACT } from '../data/content'
import { toast } from '../lib/toast'
import RecapRdv from '../components/RecapRdv'
import {
  CONFIG, SPECIALITES, specialite, employe, medecinsDuService, creneauxService, prochainCreneau,
  reserver, exporterIcs, ymd, addDays, today, parseYmd, fmtLong, fmtHeure, toMin, normalise,
  telNormalise, initiales, JOURS_COURTS,
} from '../lib/clinique'

const ETAPES = ['Spécialité', 'Médecin', 'Date & heure', 'Vos infos']
const BROUILLON = 'cn_brouillon_patient'

function lireBrouillon() {
  try { return JSON.parse(localStorage.getItem(BROUILLON)) || {} } catch { return {} }
}

// Pré-remplit la réservation depuis l'URL : /rdv?service=pediatrie&medecin=e5&date=2026-10-24&heure=09:00
function etatInitial(s, params) {
  const bk = { step: 1, serviceId: null, medecinId: null, date: null, heure: null, medecinAttribue: null }
  const sv = params.get('service')
  if (!sv || !specialite(sv)) return bk
  Object.assign(bk, { serviceId: sv, step: 2 })
  const m = params.get('medecin')
  if (!m || (m !== 'any' && !employe(s, m))) return bk
  Object.assign(bk, { medecinId: m, step: 3 })
  const d = params.get('date')
  const h = params.get('heure')
  if (d) bk.date = d
  const dispo = d && h && creneauxService(s, sv, m, d).find((c) => c.heure === h)
  if (dispo) Object.assign(bk, { heure: h, medecinAttribue: dispo.medecinId, step: 4 })
  return bk
}

const Avatar = ({ nom }) => (
  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-bright to-teal text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
    {initiales(nom)}
  </span>
)

const optCls = (sel) =>
  `w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:border-teal hover:bg-teal-light/40 ${
    sel ? 'border-teal bg-teal-light/50' : 'border-slate-200 bg-white'
  }`

export default function RendezVous() {
  const s = useClinique()
  const [params] = useSearchParams()
  const [bk, setBk] = useState(() => etatInitial(s, params))
  const [rdv, setRdv] = useState(null)
  const haut = useRef(null)

  const aller = (patch) => {
    setBk((b) => ({ ...b, ...patch }))
    haut.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sv = bk.serviceId && specialite(bk.serviceId)

  return (
    <>
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">En ligne, confirmé immédiatement</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Prendre un rendez-vous</h1>
          <p className="text-white/75 text-lg max-w-2xl">4 étapes rapides, sans inscription. Vous voyez les vrais créneaux libres de nos médecins et recevez votre code de réservation tout de suite.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-slate-50 scroll-mt-24" ref={haut}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-5 md:p-9 shadow-lg border border-slate-100">
            {rdv ? (
              <Confirmation s={s} rdv={rdv} />
            ) : (
              <>
                <ol className="grid grid-cols-4 gap-2 mb-6">
                  {ETAPES.map((label, i) => {
                    const n = i + 1
                    const etat = n < bk.step ? 'done' : n === bk.step ? 'cur' : 'todo'
                    return (
                      <li key={label} className={`pt-2.5 border-t-4 flex items-center gap-2 text-sm font-semibold ${
                        etat === 'cur' ? 'border-teal text-blue-deep' : etat === 'done' ? 'border-teal/40 text-slate-600' : 'border-slate-200 text-slate-400'}`}>
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                          etat === 'cur' ? 'bg-teal text-white' : etat === 'done' ? 'bg-teal-light text-teal' : 'bg-slate-200 text-slate-500'}`}>{n}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </li>
                    )
                  })}
                </ol>

                {/* Récapitulatif cliquable : revenir à une étape */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {sv && bk.step > 1 && (
                    <button onClick={() => aller({ step: 1 })} className="px-3 py-1.5 rounded-full bg-teal-light text-teal-dark text-sm font-semibold hover:bg-teal/20">{sv.emoji} {sv.nom}</button>
                  )}
                  {bk.medecinId && bk.step > 2 && (
                    <button onClick={() => aller({ step: 2 })} className="px-3 py-1.5 rounded-full bg-teal-light text-teal-dark text-sm font-semibold hover:bg-teal/20">
                      {bk.medecinId === 'any' ? 'Premier disponible' : employe(s, bk.medecinId)?.nom}
                    </button>
                  )}
                  {bk.heure && bk.step > 3 && (
                    <button onClick={() => aller({ step: 3 })} className="px-3 py-1.5 rounded-full bg-teal-light text-teal-dark text-sm font-semibold hover:bg-teal/20 first-letter:uppercase">
                      {fmtLong(bk.date)} · {fmtHeure(bk.heure)}
                    </button>
                  )}
                </div>

                {bk.step === 1 && <EtapeSpecialite bk={bk} choisir={(id) => aller(id === bk.serviceId ? { step: 2 } : { serviceId: id, medecinId: null, date: null, heure: null, step: 2 })} />}
                {bk.step === 2 && <EtapeMedecin s={s} bk={bk} retour={() => aller({ step: 1 })} choisir={(id) => aller({ medecinId: id, heure: id === bk.medecinId ? bk.heure : null, step: 3 })} />}
                {bk.step === 3 && (
                  <EtapeCreneau s={s} bk={bk} retour={() => aller({ step: 2 })}
                    choisirJour={(date) => setBk((b) => ({ ...b, date, heure: null }))}
                    choisirHeure={(date, heure, medecinAttribue) => aller({ date, heure, medecinAttribue, step: 4 })} />
                )}
                {bk.step === 4 && (
                  <EtapeInfos s={s} bk={bk} retour={() => aller({ step: 3 })}
                    confirmer={(patient) => {
                      const res = reserver({ serviceId: bk.serviceId, medecinId: bk.medecinAttribue, date: bk.date, heure: bk.heure, patient })
                      if (!res.ok) {
                        toast("Ce créneau vient d'être réservé. Choisissez-en un autre.")
                        aller({ heure: null, step: 3 })
                        return
                      }
                      setRdv(res.rdv)
                      haut.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }} />
                )}
              </>
            )}
          </div>

          <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-700">
            <strong>Urgence ?</strong> Ne réservez pas en ligne : présentez-vous directement aux urgences (24h/24) ou appelez le{' '}
            <a href={`tel:${CONTACT.tel1Raw}`} className="font-bold underline">{CONTACT.tel1}</a>.
          </div>
        </div>
      </section>
    </>
  )
}

function EtapeSpecialite({ bk, choisir }) {
  const [q, setQ] = useState('')
  const n = normalise(q.trim())
  const liste = SPECIALITES.filter((x) => !n || normalise(`${x.nom} ${x.desc} ${x.mots}`).includes(n))
  return (
    <>
      <h2 className="font-display text-2xl text-blue-deep mb-4">Quelle spécialité ?</h2>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher une spécialité"
        placeholder="Rechercher (ex. enfant, yeux, grossesse…)"
        className="w-full mb-4 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {liste.map((x) => (
          <button key={x.id} onClick={() => choisir(x.id)} className={optCls(bk.serviceId === x.id)}>
            <span className="w-11 h-11 rounded-xl bg-teal-light flex items-center justify-center text-xl flex-shrink-0">{x.emoji}</span>
            <span>
              <strong className="block text-blue-deep">{x.nom}</strong>
              <span className="text-xs text-slate-500">{x.desc}</span>
            </span>
          </button>
        ))}
        {!liste.length && <p className="text-slate-400 text-center py-6 sm:col-span-2">Aucun résultat. Essayez un autre mot.</p>}
      </div>
    </>
  )
}

function Dispo({ c }) {
  if (!c) return <span className="block text-xs text-slate-400 mt-0.5">Aucune disponibilité sous 3 semaines</span>
  return (
    <span className="block text-xs font-bold text-emerald-600 mt-0.5">
      Dès {c.date === ymd(today()) ? "aujourd'hui" : fmtLong(c.date)} à {fmtHeure(c.heure)}
    </span>
  )
}

function EtapeMedecin({ s, bk, choisir, retour }) {
  const meds = medecinsDuService(s, bk.serviceId)
  return (
    <>
      <h2 className="font-display text-2xl text-blue-deep mb-4">Avec quel médecin ?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={() => choisir('any')} className={optCls(bk.medecinId === 'any')}>
          <span className="w-11 h-11 rounded-full bg-gradient-to-br from-teal to-gold text-white text-lg flex items-center justify-center flex-shrink-0">⚡</span>
          <span>
            <strong className="block text-blue-deep">Le premier disponible</strong>
            <span className="text-xs text-slate-500">Le plus rapide</span>
            <Dispo c={prochainCreneau(s, bk.serviceId, 'any')} />
          </span>
        </button>
        {meds.map((m) => (
          <button key={m.id} onClick={() => choisir(m.id)} className={optCls(bk.medecinId === m.id)}>
            <Avatar nom={m.nom} />
            <span>
              <strong className="block text-blue-deep">{m.nom}</strong>
              <span className="text-xs text-slate-500">{specialite(bk.serviceId).nom}</span>
              <Dispo c={prochainCreneau(s, bk.serviceId, m.id)} />
            </span>
          </button>
        ))}
      </div>
      <BoutonRetour onClick={retour} />
    </>
  )
}

function EtapeCreneau({ s, bk, choisirJour, choisirHeure, retour }) {
  const jours = Array.from({ length: CONFIG.joursReservables }, (_, i) => {
    const d = ymd(addDays(today(), i))
    return { d, n: creneauxService(s, bk.serviceId, bk.medecinId, d).length }
  })
  // Date affichée : celle choisie si elle a des créneaux, sinon la première disponible
  const date = jours.find((j) => j.d === bk.date && j.n)?.d ?? jours.find((j) => j.n)?.d

  if (!date) {
    return (
      <>
        <h2 className="font-display text-2xl text-blue-deep mb-4">Choisissez une date</h2>
        <p className="bg-amber-50 text-amber-800 rounded-xl p-4 text-sm">
          Aucun créneau disponible dans les {CONFIG.joursReservables} prochains jours pour ce choix.
          Essayez « Le premier disponible » ou appelez le {CONTACT.tel1}.
        </p>
        <BoutonRetour onClick={retour} label="← Changer de médecin" />
      </>
    )
  }

  const creneaux = creneauxService(s, bk.serviceId, bk.medecinId, date)
  const groupes = [
    ['Matin', creneaux.filter((c) => toMin(c.heure) < 720)],
    ['Après-midi', creneaux.filter((c) => toMin(c.heure) >= 720)],
  ]
  return (
    <>
      <h2 className="font-display text-2xl text-blue-deep mb-4">Choisissez une date et une heure</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x" role="listbox" aria-label="Dates">
        {jours.map(({ d, n }) => {
          const dt = parseYmd(d)
          const sel = d === date
          return (
            <button key={d} disabled={!n} onClick={() => choisirJour(d)} aria-label={`${fmtLong(d)}, ${n} créneaux`}
              className={`snap-start flex-shrink-0 w-[76px] py-2.5 rounded-xl border-2 text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                sel ? 'bg-teal border-teal text-white' : 'bg-white border-slate-200 hover:border-teal'}`}>
              <span className={`block text-[11px] font-bold uppercase ${sel ? 'text-white/80' : 'text-slate-400'}`}>
                {d === ymd(today()) ? 'auj.' : JOURS_COURTS[dt.getDay()]}
              </span>
              <span className="block text-xl font-bold leading-tight">{dt.getDate()}</span>
              <span className={`block text-[11px] ${sel ? 'text-white/80' : 'text-slate-400'}`}>{dt.toLocaleDateString('fr-FR', { month: 'short' })}</span>
              <span className={`block text-[11px] font-bold ${sel ? 'text-white' : n ? 'text-emerald-600' : 'text-slate-400'}`}>{n ? `${n} dispo` : 'complet'}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-4 font-bold text-blue-deep first-letter:uppercase">{fmtLong(date)}</p>
      {groupes.map(([titre, liste]) => liste.length > 0 && (
        <div key={titre} className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{titre}</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {liste.map((c) => (
              <button key={c.heure} onClick={() => choisirHeure(date, c.heure, c.medecinId)}
                className={`py-2.5 rounded-lg border-2 font-bold text-sm transition-colors ${
                  bk.heure === c.heure && bk.date === date ? 'bg-teal border-teal text-white' : 'bg-teal-light/50 border-teal/20 text-teal-dark hover:bg-teal-light'}`}>
                {fmtHeure(c.heure)}
              </button>
            ))}
          </div>
        </div>
      ))}
      <BoutonRetour onClick={retour} />
    </>
  )
}

const champCls = (invalide) =>
  `w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:border-teal transition-colors ${invalide ? 'border-red-400' : 'border-slate-200'}`

function Pills({ f, maj, name, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <label key={v} className="cursor-pointer">
          <input type="radio" name={name} value={v} checked={f[name] === v} onChange={maj} className="peer sr-only" />
          <span className="inline-block px-4 py-2 rounded-full border-2 text-sm font-semibold border-slate-200 peer-checked:border-teal peer-checked:bg-teal-light peer-checked:text-teal-dark peer-focus-visible:ring-2 peer-focus-visible:ring-teal/40">{l}</span>
        </label>
      ))}
    </div>
  )
}

function EtapeInfos({ s, bk, confirmer, retour }) {
  const [f, setF] = useState(() => ({ pour: 'moi', nom: '', prenom: '', tel: '', email: '', naissance: '', premiere: 'non', motif: '', consent: false, ...lireBrouillon() }))
  const [erreurs, setErreurs] = useState({})
  const maj = (e) => {
    const { name, value, type, checked } = e.target
    setF((x) => ({ ...x, [name]: type === 'checkbox' ? checked : value }))
  }
  const med = employe(s, bk.medecinAttribue)

  const envoyer = (e) => {
    e.preventDefault()
    const err = {
      nom: !f.nom.trim(),
      prenom: !f.prenom.trim(),
      tel: telNormalise(f.tel).length < 9,
      consent: !f.consent,
    }
    setErreurs(err)
    if (Object.values(err).some(Boolean)) {
      toast(err.consent && !err.nom && !err.prenom && !err.tel
        ? "Merci d'accepter l'utilisation de vos informations."
        : 'Merci de compléter les champs obligatoires (téléphone : 9 chiffres minimum).')
      return
    }
    const patient = {
      nom: f.nom.trim(), prenom: f.prenom.trim(), tel: f.tel.trim(), email: f.email.trim(),
      naissance: f.naissance, motif: f.motif.trim(), premiere: f.premiere === 'oui', pourProche: f.pour === 'proche',
    }
    try { localStorage.setItem(BROUILLON, JSON.stringify({ nom: patient.nom, prenom: patient.prenom, tel: patient.tel, email: patient.email })) } catch { /* facultatif */ }
    confirmer(patient)
  }

  return (
    <form onSubmit={envoyer} noValidate>
      <h2 className="font-display text-2xl text-blue-deep mb-4">Vos coordonnées</h2>
      <p className="bg-teal-light/60 text-teal-dark rounded-xl p-4 text-sm mb-6">
        Rendez-vous le <strong>{fmtLong(bk.date)}</strong> à <strong>{fmtHeure(bk.heure)}</strong> avec <strong>{med?.nom}</strong> — {specialite(bk.serviceId).nom}.
      </p>

      <div className="space-y-5">
        <div>
          <span className="block text-sm font-semibold text-slate-700 mb-2">Ce rendez-vous est pour</span>
          <Pills f={f} maj={maj} name="pour" options={[['moi', 'Moi-même'], ['proche', 'Un proche / mon enfant']]} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block text-sm font-semibold text-slate-700">Nom du patient *
            <input name="nom" value={f.nom} onChange={maj} autoComplete="family-name" className={`mt-1.5 ${champCls(erreurs.nom)}`} />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Prénom du patient *
            <input name="prenom" value={f.prenom} onChange={maj} autoComplete="given-name" className={`mt-1.5 ${champCls(erreurs.prenom)}`} />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block text-sm font-semibold text-slate-700">Téléphone *
            <input name="tel" type="tel" value={f.tel} onChange={maj} autoComplete="tel" placeholder="+243 8XX XXX XXX" className={`mt-1.5 ${champCls(erreurs.tel)}`} />
            <span className="block text-xs font-normal text-slate-400 mt-1">Pour la confirmation et le rappel du rendez-vous.</span>
          </label>
          <label className="block text-sm font-semibold text-slate-700">E-mail (facultatif)
            <input name="email" type="email" value={f.email} onChange={maj} autoComplete="email" className={`mt-1.5 ${champCls(false)}`} />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="block text-sm font-semibold text-slate-700">Date de naissance
            <input name="naissance" type="date" max={ymd(today())} value={f.naissance} onChange={maj} className={`mt-1.5 ${champCls(false)}`} />
          </label>
          <div>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Première visite à la clinique ?</span>
            <Pills f={f} maj={maj} name="premiere" options={[['oui', 'Oui'], ['non', 'Non, déjà suivi·e']]} />
          </div>
        </div>
        <label className="block text-sm font-semibold text-slate-700">Motif de la consultation
          <textarea name="motif" rows={3} value={f.motif} onChange={maj} placeholder="Décrivez brièvement vos symptômes ou la raison de la visite"
            className={`mt-1.5 resize-none ${champCls(false)}`} />
        </label>
        <label className={`flex gap-3 items-start text-sm ${erreurs.consent ? 'text-red-600' : 'text-slate-600'}`}>
          <input type="checkbox" name="consent" checked={f.consent} onChange={maj} className="mt-1 accent-teal" />
          J'accepte que la clinique utilise ces informations pour gérer mon rendez-vous et me contacter.
        </label>
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-8">
        <button type="button" onClick={retour} className="px-5 py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-600 hover:border-teal hover:text-teal">← Retour</button>
        <button type="submit" className="px-7 py-3.5 bg-teal hover:bg-teal-dark text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl">
          Confirmer le rendez-vous
        </button>
      </div>
    </form>
  )
}

function BoutonRetour({ onClick, label = '← Retour' }) {
  return (
    <div className="mt-7">
      <button onClick={onClick} className="px-5 py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-600 hover:border-teal hover:text-teal">{label}</button>
    </div>
  )
}

function Confirmation({ s, rdv }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 text-4xl flex items-center justify-center mb-4">✓</div>
      <h2 className="font-display text-3xl text-blue-deep mb-2">Rendez-vous confirmé !</h2>
      <p className="text-slate-500">Conservez votre code : il vous sera demandé à l'accueil.</p>
      <div className="inline-block font-mono text-2xl font-bold tracking-[.15em] text-teal border-2 border-dashed border-teal rounded-xl px-5 py-2 my-4">{rdv.code}</div>
      <RecapRdv s={s} rdv={rdv} />
      <p className="text-sm text-slate-500 mb-5">Merci d'arriver <strong>15 minutes avant</strong> avec une pièce d'identité, vos ordonnances et résultats d'examens récents.</p>
      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <button onClick={() => exporterIcs(s, rdv)} className="px-5 py-3 bg-teal hover:bg-teal-dark text-white font-semibold rounded-xl">📅 Ajouter à mon agenda</button>
        <button onClick={() => window.print()} className="px-5 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-600 hover:border-teal hover:text-teal">Imprimer</button>
        <Link to="/" className="px-5 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-600 hover:border-teal hover:text-teal">Accueil</Link>
      </div>
      <p className="text-sm text-slate-400 mt-6 print:hidden">
        Besoin d'annuler ? Rendez-vous dans <Link to={`/mon-rdv?code=${encodeURIComponent(rdv.code)}`} className="text-teal font-semibold">Mon rendez-vous</Link>.
      </p>
    </div>
  )
}
