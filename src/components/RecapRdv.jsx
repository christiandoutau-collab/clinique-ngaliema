import { STATUTS, employe, specialite, fmtLong, fmtHeure } from '../lib/clinique'

export default function RecapRdv({ s, rdv, statut = false }) {
  const med = employe(s, rdv.medecinId)
  const lignes = [
    statut && ['Statut', STATUTS[rdv.statut].label],
    ['Patient', `${rdv.patient.prenom} ${rdv.patient.nom}`],
    ['Date', `${fmtLong(rdv.date)} · ${fmtHeure(rdv.heure)}`],
    ['Spécialité', specialite(rdv.serviceId)?.nom],
    ['Médecin', med ? med.nom : '—'],
    ['Lieu', 'Clinique Ngaliema, av. Papa Ileo, Gombe'],
  ].filter(Boolean)
  return (
    <dl className="text-left border border-slate-200 rounded-xl divide-y divide-slate-200 my-5">
      {lignes.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] gap-3 px-4 py-3 text-sm">
          <dt className="text-slate-400">{k}</dt>
          <dd className={`font-semibold first-letter:uppercase ${k === 'Statut' && rdv.statut === 'annule' ? 'text-red-600' : 'text-blue-deep'}`}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}
