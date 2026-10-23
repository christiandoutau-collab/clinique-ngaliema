import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useClinique } from '../hooks/useClinique'
import { toast } from '../lib/toast'
import GestionGalerie from '../components/GestionGalerie'
import {
  CONFIG, POSTES, ROLES, STATUTS, PLAGES_CONSULT, TOUS_SERVICES, nomService, specialite, employe,
  posteDe, posteParDefaut, estSurcharge, alerteRepos, rdvActifs, definirPoste, changerStatut,
  ajouterEmploye, retirerEmploye, reinitialiser, telecharger, ymd, parseYmd, addDays, today, lundi,
  fmtLong, fmtCourt, fmtHeure, normalise, initiales, JOURS_COURTS,
} from '../lib/clinique'

const SESSION = 'cn_staff'
const lireSession = () => { try { return sessionStorage.getItem(SESSION) === '1' } catch { return false } }
const ecrireSession = (v) => { try { v ? sessionStorage.setItem(SESSION, '1') : sessionStorage.removeItem(SESSION) } catch { /* mémoire seule */ } }

const btnGhost = 'px-3.5 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-teal hover:text-teal transition-colors'
const select = 'px-3 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:border-teal'

export default function Personnel() {
  const [connecte, setConnecte] = useState(lireSession)
  const [onglet, setOnglet] = useState('planning')

  if (!connecte) return <Connexion onOk={() => { ecrireSession(true); setConnecte(true) }} />

  return (
    <section className="py-10 bg-slate-50 min-h-[70vh] print:bg-white print:py-0">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-3xl text-blue-deep">Espace personnel</h1>
          <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 print:hidden" role="tablist">
            {[['planning', 'Planning'], ['rdv', 'Rendez-vous'], ['equipe', 'Équipe'], ['galerie', 'Galerie']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={onglet === k} onClick={() => setOnglet(k)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${onglet === k ? 'bg-teal text-white' : 'text-slate-500 hover:text-blue-deep'}`}>{l}</button>
            ))}
          </div>
          <button onClick={() => { ecrireSession(false); setConnecte(false) }} className={`${btnGhost} print:hidden`}>Se déconnecter</button>
        </div>
        {onglet === 'planning' && <Planning />}
        {onglet === 'rdv' && <RdvDuJour />}
        {onglet === 'equipe' && <Equipe />}
        {onglet === 'galerie' && <GestionGalerie />}
      </div>
    </section>
  )
}

function Connexion({ onOk }) {
  const [pin, setPin] = useState('')
  const envoyer = (e) => {
    e.preventDefault()
    if (pin === CONFIG.pinPersonnel) onOk()
    else { toast('Code incorrect.'); setPin('') }
  }
  return (
    <section className="py-16 bg-slate-50 min-h-[60vh]">
      <form onSubmit={envoyer} className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <h1 className="font-display text-3xl text-blue-deep mb-2">Espace personnel</h1>
          <p className="text-slate-500 mb-6 text-sm">Planning des équipes et rendez-vous du jour. Accès réservé au personnel de la clinique.</p>
          <label className="block text-sm font-semibold text-slate-700">Code d'accès
            <input type="password" inputMode="numeric" autoComplete="current-password" autoFocus required value={pin} onChange={(e) => setPin(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal" />
          </label>
          <button className="w-full mt-5 py-3 bg-teal hover:bg-teal-dark text-white font-bold rounded-xl">Se connecter</button>
          <p className="mt-5 bg-teal-light/60 text-teal-dark rounded-xl p-3 text-sm">Démonstration : code <strong>{CONFIG.pinPersonnel}</strong>.</p>
        </div>
      </form>
    </section>
  )
}

function Stat({ label, valeur, alerte = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      <strong className={`block text-2xl ${alerte ? 'text-red-600' : 'text-blue-deep'}`}>{valeur}</strong>
    </div>
  )
}

const ordreRoles = Object.keys(ROLES)

// ── Planning hebdomadaire ─────────────────────────────────
function Planning() {
  const s = useClinique()
  const [semaine, setSemaine] = useState(() => lundi(today()))
  const [filtreRole, setFiltreRole] = useState('')
  const [filtreService, setFiltreService] = useState('')
  const [menu, setMenu] = useState(null) // { empId, date, top, left }

  const jours = Array.from({ length: 7 }, (_, i) => ymd(addDays(semaine, i)))
  const auj = ymd(today())
  const emps = s.employes
    .filter((e) => (!filtreRole || e.role === filtreRole) && (!filtreService || e.service === filtreService))
    .sort((a, b) => ordreRoles.indexOf(a.role) - ordreRoles.indexOf(b.role) || (a.ordre ?? 0) - (b.ordre ?? 0))

  const lignes = emps.map((e) => {
    const cellules = jours.map((d) => ({ d, p: posteDe(s, e.id, d), alerte: alerteRepos(s, e.id, d), modif: estSurcharge(s, e.id, d) }))
    return { e, cellules, heures: cellules.reduce((n, c) => n + POSTES[c.p].heures, 0) }
  })
  const nbAlertes = lignes.reduce((n, l) => n + l.cellules.filter((c) => c.alerte).length, 0)
  const nbDepassements = lignes.filter((l) => l.heures > CONFIG.heuresMaxSemaine).length
  const nbModifs = jours.reduce((n, d) => n + s.employes.filter((e) => estSurcharge(s, e.id, d)).length, 0)
  const couverture = jours.map((d) => ({
    nuit: s.employes.filter((e) => ['infirmier', 'medecin'].includes(e.role) && ['N', 'G'].includes(posteDe(s, e.id, d))).length,
    consult: s.employes.filter((e) => e.role === 'medecin' && PLAGES_CONSULT[posteDe(s, e.id, d)]).length,
  }))
  const nuitsFaibles = couverture.filter((c) => c.nuit < CONFIG.effectifNuitMin).length
  const servicesPresents = [...new Set(s.employes.map((e) => e.service))]

  useEffect(() => {
    if (!menu) return
    const fermer = () => setMenu(null)
    const clavier = (e) => { if (e.key === 'Escape') fermer() }
    window.addEventListener('scroll', fermer, { passive: true })
    window.addEventListener('resize', fermer)
    window.addEventListener('keydown', clavier)
    return () => {
      window.removeEventListener('scroll', fermer)
      window.removeEventListener('resize', fermer)
      window.removeEventListener('keydown', clavier)
    }
  }, [menu])

  const ouvrirMenu = (ev, empId, date) => {
    const r = ev.currentTarget.getBoundingClientRect()
    const hauteur = 380
    setMenu({
      empId, date,
      top: r.bottom + 6 + hauteur > window.innerHeight ? Math.max(8, r.top - hauteur - 6) : r.bottom + 6,
      left: Math.min(Math.max(8, r.left + r.width / 2 - 120), window.innerWidth - 248),
    })
  }

  const choisirPoste = (code) => {
    const { empId, date } = menu
    const emp = employe(s, empId)
    if (emp.role === 'medecin' && code && !PLAGES_CONSULT[code]) {
      const n = rdvActifs(s).filter((r) => r.medecinId === empId && r.date === date && ['confirme', 'arrive'].includes(r.statut)).length
      if (n && !confirm(`${emp.nom} a ${n} rendez-vous patient ce jour-là. Ils resteront à réaffecter (onglet Rendez-vous). Continuer ?`)) return
    }
    definirPoste(empId, date, code)
    setMenu(null)
    toast(`Planning mis à jour : ${emp.nom}`)
  }

  const exporterCsv = () => {
    const entete = ['Employé', 'Fonction', 'Service', ...jours.map(fmtCourt), 'Heures']
    const rows = lignes.map(({ e, cellules, heures }) =>
      [e.nom, ROLES[e.role].label, nomService(e.service), ...cellules.map((c) => `${POSTES[c.p].label} ${POSTES[c.p].h}`.trim()), heures])
    const csv = [entete, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n')
    telecharger(`planning-${jours[0]}.csv`, `\ufeff${csv}`, 'text/csv;charset=utf-8')
  }

  const fin = addDays(semaine, 6)

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Personnel affiché" valeur={emps.length} />
        <Stat label="Postes modifiés cette semaine" valeur={nbModifs} />
        <Stat label="Alertes repos" valeur={nbAlertes} alerte={nbAlertes > 0} />
        <Stat label={`> ${CONFIG.heuresMaxSemaine} h · nuits sous-dotées`} valeur={`${nbDepassements} · ${nuitsFaibles}`} alerte={nbDepassements + nuitsFaibles > 0} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-200 print:hidden">
          <button onClick={() => setSemaine(addDays(semaine, -7))} className={btnGhost} aria-label="Semaine précédente">‹</button>
          <span className="font-bold text-blue-deep min-w-[190px] text-center">
            {semaine.getDate()} {semaine.toLocaleDateString('fr-FR', { month: 'short' })} – {fin.getDate()} {fin.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
          </span>
          <button onClick={() => setSemaine(addDays(semaine, 7))} className={btnGhost} aria-label="Semaine suivante">›</button>
          <button onClick={() => setSemaine(lundi(today()))} className={btnGhost}>Cette semaine</button>
          <span className="flex-1" />
          <select value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)} className={select} aria-label="Filtrer par fonction">
            <option value="">Toutes fonctions</option>
            {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
          </select>
          <select value={filtreService} onChange={(e) => setFiltreService(e.target.value)} className={select} aria-label="Filtrer par service">
            <option value="">Tous services</option>
            {servicesPresents.map((id) => <option key={id} value={id}>{nomService(id)}</option>)}
          </select>
          <button onClick={exporterCsv} className={btnGhost}>Exporter CSV</button>
          <button onClick={() => window.print()} className={btnGhost}>Imprimer</button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 text-xs print:hidden">
          {Object.entries(POSTES).map(([k, p]) => (
            <span key={k} className={`px-2.5 py-1 rounded-full font-bold ${p.cls}`}>{p.label}{p.h && ` · ${p.h}`}</span>
          ))}
          <span className="ml-auto text-slate-400">Cliquez sur une case pour la modifier · ● = modifié manuellement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-white text-left px-4 py-3 text-xs uppercase tracking-wide text-slate-400 border-b border-r border-slate-200 min-w-[210px]">Employé</th>
                {jours.map((d) => {
                  const dt = parseYmd(d)
                  return (
                    <th key={d} className={`px-1.5 py-3 text-xs uppercase tracking-wide border-b border-slate-200 ${d === auj ? 'text-teal' : 'text-slate-400'}`}>
                      {JOURS_COURTS[dt.getDay()]}<b className={`block text-base normal-case tracking-normal ${d === auj ? 'text-teal' : 'text-blue-deep'}`}>{dt.getDate()}</b>
                    </th>
                  )
                })}
                <th className="px-2 py-3 text-xs uppercase text-slate-400 border-b border-slate-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(({ e, cellules, heures }, i) => {
                const entete = i === 0 || lignes[i - 1].e.role !== e.role
                return [
                  entete && (
                    <tr key={`g-${e.role}`}>
                      <th colSpan={9} className="sticky left-0 bg-slate-50 text-left px-4 py-2 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">{ROLES[e.role].label}s</th>
                    </tr>
                  ),
                  <tr key={e.id}>
                    <th className="sticky left-0 z-10 bg-white text-left px-4 py-2 border-b border-r border-slate-200 font-normal">
                      <span className="flex items-center gap-2 font-bold text-blue-deep"><span className={`w-2.5 h-2.5 rounded-full ${ROLES[e.role].dot}`} />{e.nom}</span>
                      <span className="block text-xs text-slate-400 ml-[18px]">{nomService(e.service)}</span>
                    </th>
                    {cellules.map(({ d, p, alerte, modif }) => (
                      <td key={d} className={`p-1.5 border-b border-slate-200 ${d === auj ? 'bg-teal-light/30' : ''}`}>
                        <button onClick={(ev) => ouvrirMenu(ev, e.id, d)}
                          title={`${POSTES[p].label}${alerte ? ' — repos insuffisant après une nuit/garde' : ''}${modif ? ' (modifié)' : ''}`}
                          className={`relative w-full min-w-[92px] rounded-lg py-1.5 px-1 text-xs font-bold leading-tight transition-transform hover:scale-105 ${POSTES[p].cls} ${alerte ? 'ring-2 ring-red-500' : ''}`}>
                          {POSTES[p].label}
                          <small className="block font-semibold opacity-75 text-[10px]">{POSTES[p].h || '\u00a0'}</small>
                          {modif && <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60" />}
                        </button>
                      </td>
                    ))}
                    <td className={`px-2 text-center font-bold border-b border-slate-200 ${heures > CONFIG.heuresMaxSemaine ? 'text-red-600' : 'text-blue-deep'}`}
                      title={heures > CONFIG.heuresMaxSemaine ? `Au-delà de ${CONFIG.heuresMaxSemaine} h` : undefined}>{heures} h</td>
                  </tr>,
                ]
              })}
              {!lignes.length && <tr><td colSpan={9} className="text-center text-slate-400 py-8">Aucun employé pour ce filtre.</td></tr>}
              <tr className="bg-slate-50 text-xs">
                <th className="sticky left-0 bg-slate-50 text-left px-4 py-2.5 border-r border-b border-slate-200">Effectif de nuit (min. {CONFIG.effectifNuitMin})</th>
                {couverture.map((c, i) => (
                  <td key={i} className={`text-center font-bold border-b border-slate-200 ${c.nuit < CONFIG.effectifNuitMin ? 'text-red-600' : 'text-emerald-600'}`}>{c.nuit}</td>
                ))}
                <td className="border-b border-slate-200" />
              </tr>
              <tr className="bg-slate-50 text-xs">
                <th className="sticky left-0 bg-slate-50 text-left px-4 py-2.5 border-r border-slate-200">Médecins en consultation</th>
                {couverture.map((c, i) => <td key={i} className="text-center font-bold">{c.consult}</td>)}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {menu && <MenuPoste s={s} menu={menu} choisir={choisirPoste} fermer={() => setMenu(null)} />}
    </>
  )
}

function MenuPoste({ s, menu, choisir, fermer }) {
  const emp = employe(s, menu.empId)
  const actuel = posteDe(s, menu.empId, menu.date)
  const defaut = posteParDefaut(emp, menu.date)
  const nbRdv = rdvActifs(s).filter((r) => r.medecinId === emp.id && r.date === menu.date).length
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={fermer} aria-hidden="true" />
      <div role="menu" style={{ top: menu.top, left: menu.left }} className="fixed z-50 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2">
        <p className="px-2 pt-1 pb-2 text-xs font-bold text-slate-400 first-letter:uppercase">{emp.nom} · {fmtLong(menu.date)}</p>
        {Object.entries(POSTES).map(([k, p]) => (
          <button key={k} role="menuitem" onClick={() => choisir(k)} className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.cls}`}>{p.label}</span>
            <span className="text-xs text-slate-400">{p.h}{k === actuel && ' ✓'}</span>
          </button>
        ))}
        <hr className="my-1.5 border-slate-200" />
        <button role="menuitem" onClick={() => choisir(null)} className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-600">
          Planning type <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${POSTES[defaut].cls}`}>{POSTES[defaut].label}</span>
        </button>
        {emp.role === 'medecin' && nbRdv > 0 && (
          <p className="mx-1 mt-1.5 bg-amber-50 text-amber-800 rounded-lg p-2 text-xs">{nbRdv} RDV patient ce jour-là.</p>
        )}
      </div>
    </>
  )
}

// ── Rendez-vous du jour ───────────────────────────────────
function RdvDuJour() {
  const s = useClinique()
  const [jour, setJour] = useState(() => ymd(today()))
  const [filtreMed, setFiltreMed] = useState('')
  const medecins = s.employes.filter((e) => e.role === 'medecin')
  const liste = s.rdvs
    .filter((r) => r.date === jour && (!filtreMed || r.medecinId === filtreMed))
    .sort((a, b) => a.heure.localeCompare(b.heure))
  const compte = (st) => liste.filter((r) => r.statut === st).length
  const actifs = liste.filter((r) => r.statut !== 'annule')

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Rendez-vous" valeur={actifs.length} />
        <Stat label="Arrivés / terminés" valeur={`${compte('arrive')} / ${compte('termine')}`} />
        <Stat label="Premières visites" valeur={actifs.filter((r) => r.patient.premiere).length} />
        <Stat label="Absents · annulés" valeur={`${compte('absent')} · ${compte('annule')}`} alerte={compte('absent') > 0} />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-200">
          <button onClick={() => setJour(ymd(addDays(parseYmd(jour), -1)))} className={btnGhost} aria-label="Jour précédent">‹</button>
          <input type="date" value={jour} onChange={(e) => e.target.value && setJour(e.target.value)} className={select} aria-label="Date" />
          <button onClick={() => setJour(ymd(addDays(parseYmd(jour), 1)))} className={btnGhost} aria-label="Jour suivant">›</button>
          <button onClick={() => setJour(ymd(today()))} className={btnGhost}>Aujourd'hui</button>
          <span className="flex-1" />
          <select value={filtreMed} onChange={(e) => setFiltreMed(e.target.value)} className={select} aria-label="Filtrer par médecin">
            <option value="">Tous les médecins</option>
            {medecins.map((m) => <option key={m.id} value={m.id}>{m.nom} — {nomService(m.service)}</option>)}
          </select>
          <Link to="/rdv" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white text-sm font-bold rounded-lg">+ Nouveau RDV</Link>
        </div>
        <ul className="divide-y divide-slate-200">
          {liste.map((r) => {
            const med = employe(s, r.medecinId)
            const aReaffecter = ['confirme', 'arrive'].includes(r.statut) && !PLAGES_CONSULT[posteDe(s, r.medecinId, r.date)]
            return (
              <li key={r.id} className="grid grid-cols-[56px_1fr] sm:grid-cols-[70px_1fr_auto] gap-3 sm:gap-4 items-center px-4 py-3.5">
                <span className="text-lg font-bold text-teal">{fmtHeure(r.heure)}</span>
                <div>
                  <strong className="text-blue-deep">{r.patient.prenom} {r.patient.nom}</strong>
                  {r.patient.premiere && <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">1re visite</span>}
                  <span className="block text-xs text-slate-400">
                    {specialite(r.serviceId)?.nom} · {med ? med.nom : 'Médecin retiré'} · {r.patient.tel} · {r.code}
                  </span>
                  {r.patient.motif && <span className="block text-xs text-slate-500 mt-0.5">« {r.patient.motif} »</span>}
                  {aReaffecter && <span className="block text-xs font-bold text-red-600 mt-0.5">⚠ Médecin non planifié en consultation ce jour — à réaffecter</span>}
                </div>
                <select value={r.statut} aria-label="Statut"
                  onChange={(e) => { changerStatut(r.id, e.target.value); toast(`${r.patient.prenom} ${r.patient.nom} : ${STATUTS[e.target.value].label}`) }}
                  className={`col-span-2 sm:col-span-1 ${select} font-bold ${STATUTS[r.statut].cls}`}>
                  {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </li>
            )
          })}
          {!liste.length && <li className="text-center text-slate-400 py-10">Aucun rendez-vous ce jour.</li>}
        </ul>
      </div>
    </>
  )
}

// ── Équipe ────────────────────────────────────────────────
function Equipe() {
  const s = useClinique()
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ nom: '', role: 'medecin', service: TOUS_SERVICES[0][0] })
  const n = normalise(q)
  const tri = [...s.employes].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')).filter((e) => !n || normalise(e.nom).includes(n))

  const ajouter = (e) => {
    e.preventDefault()
    if (!form.nom.trim()) return
    ajouterEmploye({ ...form, nom: form.nom.trim() })
    toast(`${form.nom.trim()} ajouté·e à l'équipe.`)
    setForm((f) => ({ ...f, nom: '' }))
  }

  const retirer = (emp) => {
    const futurs = rdvActifs(s).filter((r) => r.medecinId === emp.id && r.statut === 'confirme' && parseYmd(r.date) >= today()).length
    if (!confirm(`Retirer ${emp.nom} de l'équipe ?${futurs ? `\n${futurs} rendez-vous à venir lui sont attribués.` : ''}`)) return
    retirerEmploye(emp.id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-200">
          <strong className="text-blue-deep">{s.employes.length} membres du personnel</strong>
          <span className="flex-1" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className={select} aria-label="Rechercher un employé" />
        </div>
        <ul className="divide-y divide-slate-200">
          {tri.map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-4 py-3">
              <span className={`w-10 h-10 rounded-full text-white text-xs font-bold flex items-center justify-center ${ROLES[e.role].dot}`}>{initiales(e.nom)}</span>
              <span className="flex-1">
                <strong className="block text-blue-deep text-sm">{e.nom}</strong>
                <span className="text-xs text-slate-400">{ROLES[e.role].label} · {nomService(e.service)}</span>
              </span>
              <button onClick={() => retirer(e)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold">Retirer</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-blue-deep mb-4">Ajouter un membre</h3>
        <form onSubmit={ajouter} className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Nom complet
            <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Dr Prénom Nom" className={`w-full mt-1 ${select}`} />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Fonction
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={`w-full mt-1 ${select}`}>
              {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700">Service
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`w-full mt-1 ${select}`}>
              {TOUS_SERVICES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          <button className="w-full py-2.5 bg-teal hover:bg-teal-dark text-white font-bold rounded-lg">Ajouter</button>
          <p className="text-xs text-slate-400">Un planning type est appliqué automatiquement ; ajustez-le dans l'onglet Planning. Les médecins ajoutés deviennent réservables en ligne.</p>
        </form>
        <hr className="my-5 border-slate-200" />
        <h3 className="font-bold text-blue-deep mb-1">Données</h3>
        <p className="text-xs text-slate-400 mb-3">Enregistrées dans ce navigateur (version de démonstration).</p>
        <button onClick={() => { if (confirm('Effacer toutes les modifications (planning, rendez-vous, équipe) ?')) { reinitialiser(); toast('Données de démonstration rétablies.') } }}
          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold">Réinitialiser les données de démonstration</button>
      </div>
    </div>
  )
}
