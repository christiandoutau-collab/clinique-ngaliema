// Logique métier : spécialités, personnel, planning, créneaux et rendez-vous.
// Les données vivent dans le localStorage (version de démonstration). Pour un
// usage multi-postes, remplacer `charger`/`persister` par un backend en gardant
// la même API (subscribe / getSnapshot / actions).

export const CONFIG = {
  pinPersonnel: '1927', // code de démonstration de l'espace personnel
  dureeConsultation: 30, // minutes
  joursReservables: 21,
  heuresMaxSemaine: 48,
  effectifNuitMin: 2,
}

export const SPECIALITES = [
  { id: 'medecine-interne', nom: 'Médecine interne', emoji: '🩺', desc: "Diabète, hypertension, infections, suivi de l'adulte.", mots: 'generaliste fievre paludisme diabete tension' },
  { id: 'gyneco', nom: 'Gynéco-obstétrique', emoji: '🤰', desc: 'Suivi de grossesse, accouchement, santé de la femme.', mots: 'grossesse maternite accouchement femme' },
  { id: 'pediatrie', nom: 'Pédiatrie', emoji: '👶', desc: 'Nouveau-nés, enfants, adolescents, vaccinations.', mots: 'enfant bebe vaccin' },
  { id: 'chirurgie', nom: 'Chirurgie générale', emoji: '🔪', desc: 'Chirurgie abdominale et viscérale, hernies.', mots: 'operation ventre hernie' },
  { id: 'orthopedie', nom: 'Chirurgie orthopédique', emoji: '🦴', desc: 'Fractures, traumatologie, articulations.', mots: 'fracture os genou dos' },
  { id: 'neurochirurgie', nom: 'Neurochirurgie', emoji: '🧠', desc: 'Cerveau, moelle épinière, colonne.', mots: 'cerveau colonne nerf' },
  { id: 'urologie', nom: 'Urologie', emoji: '💧', desc: 'Reins, vessie, prostate.', mots: 'prostate rein vessie' },
  { id: 'neuropsy', nom: 'Neuropsychiatrie', emoji: '🧩', desc: 'Épilepsie, troubles neurologiques, santé mentale.', mots: 'psychiatre depression epilepsie mental' },
  { id: 'ophtalmo', nom: 'Ophtalmologie', emoji: '👁️', desc: 'Vue, lunettes, cataracte, glaucome.', mots: 'yeux vue lunettes cataracte' },
  { id: 'dentisterie', nom: 'Dentisterie', emoji: '🦷', desc: 'Soins dentaires, détartrage, extractions.', mots: 'dents dentiste carie' },
  { id: 'dermato', nom: 'Dermatologie', emoji: '🧴', desc: 'Peau, cheveux, ongles.', mots: 'peau bouton allergie' },
  { id: 'anesthesie', nom: 'Anesthésie-réanimation', emoji: '💉', desc: 'Consultation pré-anesthésique.', mots: 'anesthesie operation reanimation' },
  { id: 'orl', nom: 'ORL', emoji: '👂', desc: 'Oreilles, nez, gorge, audition.', mots: 'oreille nez gorge sinus' },
  { id: 'voyage', nom: 'Médecine de voyage', emoji: '✈️', desc: 'Vaccins internationaux, certificats.', mots: 'vaccin fievre jaune voyage certificat' },
]
const AUTRES_SERVICES = { urgences: 'Urgences', laboratoire: 'Laboratoire', imagerie: 'Imagerie', accueil: 'Accueil' }
export const TOUS_SERVICES = [...SPECIALITES.map((s) => [s.id, s.nom]), ...Object.entries(AUTRES_SERVICES)]
export const specialite = (id) => SPECIALITES.find((s) => s.id === id)
export const nomService = (id) => specialite(id)?.nom ?? AUTRES_SERVICES[id] ?? id

// Plages de consultation selon le poste du médecin ce jour-là
// (consultations externes : 8h00 – 15h30, du lundi au vendredi)
export const PLAGES_CONSULT = { M: ['08:00', '13:30'], J: ['08:00', '15:30'], A: ['14:00', '15:30'] }

export const POSTES = {
  M: { label: 'Matin', h: '07h–14h', heures: 7, cls: 'bg-sky-100 text-sky-800' },
  A: { label: 'Après-midi', h: '14h–21h', heures: 7, cls: 'bg-amber-100 text-amber-800' },
  N: { label: 'Nuit', h: '21h–07h', heures: 10, cls: 'bg-violet-100 text-violet-800' },
  J: { label: 'Journée', h: '08h–16h', heures: 8, cls: 'bg-emerald-100 text-emerald-800' },
  G: { label: 'Garde 24h', h: '08h–08h', heures: 24, cls: 'bg-rose-100 text-rose-800' },
  R: { label: 'Repos', h: '', heures: 0, cls: 'bg-slate-100 text-slate-500' },
  C: { label: 'Congé', h: '', heures: 0, cls: 'bg-yellow-100 text-yellow-800' },
}

export const ROLES = {
  medecin: { label: 'Médecin', dot: 'bg-teal' },
  infirmier: { label: 'Infirmier·ère', dot: 'bg-blue-bright' },
  technicien: { label: 'Technicien·ne', dot: 'bg-violet-500' },
  administratif: { label: 'Administratif', dot: 'bg-gold' },
}

export const STATUTS = {
  confirme: { label: 'Confirmé', cls: 'text-teal' },
  arrive: { label: 'Arrivé', cls: 'text-amber-600' },
  termine: { label: 'Terminé', cls: 'text-emerald-600' },
  absent: { label: 'Absent', cls: 'text-red-600' },
  annule: { label: 'Annulé', cls: 'text-red-600' },
}

// Équipe de démonstration (noms fictifs) — à remplacer par l'équipe réelle
const EQUIPE_DEMO = [
  ['Dr Mbuyi Kalala', 'medecin', 'medecine-interne'],
  ['Dr Nsimba Lukusa', 'medecin', 'medecine-interne'],
  ['Dr Mwamba Ilunga', 'medecin', 'gyneco'],
  ['Dr Kabeya Tshibangu', 'medecin', 'gyneco'],
  ['Dr Lutete Makiese', 'medecin', 'pediatrie'],
  ['Dr Mayala Nzuzi', 'medecin', 'pediatrie'],
  ['Dr Kasongo Mulamba', 'medecin', 'chirurgie'],
  ['Dr Bokele Ngoy', 'medecin', 'orthopedie'],
  ['Dr Mpiana Kabongo', 'medecin', 'neurochirurgie'],
  ['Dr Luzolo Diambu', 'medecin', 'urologie'],
  ['Dr Kanku Mbala', 'medecin', 'neuropsy'],
  ['Dr Ndombe Kiese', 'medecin', 'ophtalmo'],
  ['Dr Matondo Vuvu', 'medecin', 'dentisterie'],
  ['Dr Kiala Mfumu', 'medecin', 'dermato'],
  ['Dr Bakambu Ilondo', 'medecin', 'anesthesie'],
  ['Dr Nzita Malanda', 'medecin', 'orl'],
  ['Dr Pambu Lusamba', 'medecin', 'voyage'],
  ['Inf. Masika Bahati', 'infirmier', 'urgences'],
  ['Inf. Kavira Amani', 'infirmier', 'urgences'],
  ['Inf. Mukendi Odia', 'infirmier', 'medecine-interne'],
  ['Inf. Tshilanda Mado', 'infirmier', 'pediatrie'],
  ['Inf. Bolingo Sefu', 'infirmier', 'gyneco'],
  ['Inf. Lokwa Bijou', 'infirmier', 'chirurgie'],
  ['Inf. Mbemba Rose', 'infirmier', 'chirurgie'],
  ['Inf. Kalombo Jean', 'infirmier', 'urgences'],
  ['Tech. Kimpiatu Paul', 'technicien', 'laboratoire'],
  ['Tech. Ngalula Esther', 'technicien', 'imagerie'],
  ['Adm. Mpoyi Grâce', 'administratif', 'accueil'],
  ['Adm. Lembe Patrick', 'administratif', 'accueil'],
]

// ── Dates ─────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0')
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
export const lundi = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x }
export const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
export const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
export const fmtLong = (s) => parseYmd(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
export const fmtCourt = (s) => parseYmd(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
export const fmtHeure = (hhmm) => hhmm.replace(':', 'h')
export const JOURS_COURTS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']

export const normalise = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export const telNormalise = (s) => String(s).replace(/\D/g, '').replace(/^0+/, '').slice(-9)
export const initiales = (nom) =>
  nom.replace(/^(Dr|Inf\.|Tech\.|Adm\.)\s+/, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
const uid = () => Math.random().toString(36).slice(2, 10)
const codeReservation = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let c = ''
  for (let i = 0; i < 5; i++) c += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `CN-${c}`
}

// ── Planning ──────────────────────────────────────────────
// Planning type (rotation automatique) ; les modifications manuelles sont des exceptions.
export function posteParDefaut(emp, dateStr) {
  const d = parseYmd(dateStr)
  const dow = d.getDay()
  const jourAbs = Math.floor(d.getTime() / 86400000)
  const semaine = Math.floor((jourAbs + 3) / 7)
  const k = emp.ordre ?? 0
  if (emp.role === 'medecin') {
    const semaineDeGarde = (k + semaine) % 4 === 0
    if (dow === 0) return 'R'
    if (dow === 6) return semaineDeGarde ? 'G' : 'R'
    if (semaineDeGarde && dow >= 4) return 'R' // récupération avant la garde du samedi
    return (k + semaine + dow) % 3 === 0 ? 'A' : 'J'
  }
  if (emp.role === 'infirmier') {
    const cycle = ['M', 'M', 'A', 'A', 'N', 'N', 'R', 'R']
    return cycle[(jourAbs + k * 3) % cycle.length]
  }
  if (dow === 0) return 'R'
  if (dow === 6) return k % 2 === semaine % 2 ? 'M' : 'R'
  return 'J'
}

export const employe = (s, id) => s.employes.find((e) => e.id === id)
export const medecinsDuService = (s, serviceId) => s.employes.filter((e) => e.role === 'medecin' && e.service === serviceId)
export const estSurcharge = (s, empId, dateStr) => Boolean(s.postes[`${empId}|${dateStr}`])

export function posteDe(s, empId, dateStr) {
  const surcharge = s.postes[`${empId}|${dateStr}`]
  if (surcharge) return surcharge
  const emp = employe(s, empId)
  return emp ? posteParDefaut(emp, dateStr) : 'R'
}

// Repos insuffisant : nuit ou garde suivie d'un poste de jour le lendemain
export function alerteRepos(s, empId, dateStr) {
  const veille = posteDe(s, empId, ymd(addDays(parseYmd(dateStr), -1)))
  return (veille === 'N' || veille === 'G') && ['M', 'J', 'G'].includes(posteDe(s, empId, dateStr))
}

// ── Créneaux ──────────────────────────────────────────────
export const rdvActifs = (s) => s.rdvs.filter((r) => r.statut !== 'annule')

export function creneauxLibres(s, medId, dateStr) {
  const plage = PLAGES_CONSULT[posteDe(s, medId, dateStr)]
  if (!plage) return []
  const pris = new Set(rdvActifs(s).filter((r) => r.medecinId === medId && r.date === dateStr).map((r) => r.heure))
  const maintenant = new Date()
  const estAujourdhui = dateStr === ymd(maintenant)
  const limite = maintenant.getHours() * 60 + maintenant.getMinutes() + 30 // au moins 30 min d'avance
  const res = []
  for (let m = toMin(plage[0]); m + CONFIG.dureeConsultation <= toMin(plage[1]); m += CONFIG.dureeConsultation) {
    if (estAujourdhui && m < limite) continue
    const h = fromMin(m)
    if (!pris.has(h)) res.push(h)
  }
  return res
}

// Créneaux d'une spécialité à une date : [{ heure, medecinId }] (premier médecin libre par heure)
export function creneauxService(s, serviceId, medId, dateStr) {
  const meds = medId && medId !== 'any' ? [employe(s, medId)].filter(Boolean) : medecinsDuService(s, serviceId)
  const parHeure = new Map()
  for (const m of meds) {
    for (const h of creneauxLibres(s, m.id, dateStr)) if (!parHeure.has(h)) parHeure.set(h, m.id)
  }
  return [...parHeure.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([heure, medecinId]) => ({ heure, medecinId }))
}

export function prochainCreneau(s, serviceId, medId) {
  for (let i = 0; i < CONFIG.joursReservables; i++) {
    const d = ymd(addDays(today(), i))
    const c = creneauxService(s, serviceId, medId, d)
    if (c.length) return { date: d, ...c[0] }
  }
  return null
}

// ── Store ─────────────────────────────────────────────────
const CLES = { employes: 'cn_employes', postes: 'cn_postes', rdvs: 'cn_rdvs' }

function lire(cle, defaut) {
  try { const v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut } catch { return defaut }
}

function etatDemo() {
  const s = {
    employes: EQUIPE_DEMO.map(([nom, role, service], i) => ({ id: `e${i + 1}`, nom, role, service, ordre: i })),
    postes: {},
    rdvs: [],
  }
  const patients = [
    ['Kabila', 'Aline'], ['Mutombo', 'Joseph'], ['Lumbala', 'Sarah'], ['Kanza', 'Didier'], ['Nkulu', 'Ruth'],
    ['Mabiala', 'Cédric'], ['Tshala', 'Nadine'], ['Kiswendo', 'Eric'], ['Bitota', 'Grâce'], ['Ilunga', 'Patrick'],
  ]
  let p = 0
  for (let j = 0; j < 3; j++) {
    const date = ymd(addDays(today(), j))
    for (const sv of ['medecine-interne', 'pediatrie', 'gyneco', 'ophtalmo']) {
      const c = creneauxService(s, sv, 'any', date)
      if (!c.length) continue
      const choix = c[Math.min(c.length - 1, 2 + (p % 4))]
      const [nom, prenom] = patients[p % patients.length]
      s.rdvs.push({
        id: uid(), code: codeReservation(), serviceId: sv, medecinId: choix.medecinId, date, heure: choix.heure,
        patient: { nom, prenom, tel: `+24381${pad(p)}123${pad(p + 10)}`, email: '', naissance: '', motif: 'Consultation de contrôle', premiere: p % 3 === 0 },
        statut: 'confirme', creeLe: new Date().toISOString(),
      })
      p++
    }
  }
  return s
}

function charger() {
  const employes = lire(CLES.employes, null)
  if (!employes) return etatDemo()
  return { employes, postes: lire(CLES.postes, {}), rdvs: lire(CLES.rdvs, []) }
}

function persister(s) {
  try {
    for (const [k, cle] of Object.entries(CLES)) localStorage.setItem(cle, JSON.stringify(s[k]))
  } catch { /* stockage indisponible : données en mémoire seulement */ }
}

let etat = charger()
persister(etat)
const abonnes = new Set()

export const getSnapshot = () => etat
export function subscribe(fn) {
  abonnes.add(fn)
  return () => abonnes.delete(fn)
}
function commit(suivant) {
  etat = suivant
  persister(etat)
  abonnes.forEach((fn) => fn())
}

// Synchronisation entre onglets (ex. accueil + espace personnel ouverts en parallèle)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (Object.values(CLES).includes(e.key)) { etat = charger(); abonnes.forEach((fn) => fn()) }
  })
}

// ── Actions ───────────────────────────────────────────────
export function reserver({ serviceId, medecinId, date, heure, patient }) {
  if (!creneauxLibres(etat, medecinId, date).includes(heure)) return { ok: false, raison: 'pris' }
  const rdv = { id: uid(), code: codeReservation(), serviceId, medecinId, date, heure, patient, statut: 'confirme', creeLe: new Date().toISOString() }
  commit({ ...etat, rdvs: [...etat.rdvs, rdv] })
  return { ok: true, rdv }
}

export const trouverRdv = (code, tel) =>
  etat.rdvs.find((r) => r.code === code.trim().toUpperCase() && telNormalise(r.patient.tel) === telNormalise(tel))

export function changerStatut(id, statut) {
  commit({ ...etat, rdvs: etat.rdvs.map((r) => (r.id === id ? { ...r, statut } : r)) })
}

export function definirPoste(empId, dateStr, code) {
  const cle = `${empId}|${dateStr}`
  const postes = { ...etat.postes }
  const emp = employe(etat, empId)
  if (code === null || (emp && posteParDefaut(emp, dateStr) === code)) delete postes[cle]
  else postes[cle] = code
  commit({ ...etat, postes })
}

export function ajouterEmploye({ nom, role, service }) {
  const ordre = Math.max(0, ...etat.employes.map((x) => x.ordre ?? 0)) + 1
  commit({ ...etat, employes: [...etat.employes, { id: `e${uid()}`, nom, role, service, ordre }] })
}

export function retirerEmploye(id) {
  const postes = Object.fromEntries(Object.entries(etat.postes).filter(([k]) => !k.startsWith(`${id}|`)))
  commit({ ...etat, employes: etat.employes.filter((e) => e.id !== id), postes })
}

export function reinitialiser() {
  commit(etatDemo())
}

// ── Exports fichiers ──────────────────────────────────────
export function telecharger(nom, contenu, type) {
  const url = URL.createObjectURL(new Blob([contenu], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = nom
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exporterIcs(s, r) {
  const jour = r.date.replace(/-/g, '')
  const debut = `${jour}T${r.heure.replace(':', '')}00`
  const fin = `${jour}T${fromMin(toMin(r.heure) + CONFIG.dureeConsultation).replace(':', '')}00`
  const med = employe(s, r.medecinId)
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Clinique Ngaliema//RDV//FR', 'BEGIN:VEVENT',
    `UID:${r.id}@cliniquengaliema.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;TZID=Africa/Kinshasa:${debut}`, `DTEND;TZID=Africa/Kinshasa:${fin}`,
    `SUMMARY:RDV ${nomService(r.serviceId)} — Clinique Ngaliema`,
    `DESCRIPTION:Code ${r.code}\\nMédecin : ${med ? med.nom : ''}\\nArrivez 15 minutes avant.`,
    'LOCATION:Clinique Ngaliema\\, avenue Papa Ileo\\, Gombe\\, Kinshasa',
    'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Rendez-vous à la Clinique Ngaliema', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  telecharger(`rdv-${r.code}.ics`, ics, 'text/calendar')
}
