import { Link } from 'react-router-dom'
import { useClinique } from '../hooks/useClinique'
import { prochainCreneau, specialite, employe, ymd, addDays, today, fmtCourt, fmtHeure } from '../lib/clinique'

const SPECIALITES_MISES_EN_AVANT = ['medecine-interne', 'pediatrie', 'gyneco', 'dentisterie']

// Raccourci de réservation : un clic mène directement à l'étape « Vos infos »
export default function ProchainsCreneaux() {
  const s = useClinique()
  const auj = ymd(today())
  const demain = ymd(addDays(today(), 1))
  const items = SPECIALITES_MISES_EN_AVANT
    .map((id) => ({ id, c: prochainCreneau(s, id, 'any') }))
    .filter((x) => x.c)

  return (
    <div className="bg-white text-blue-deep rounded-2xl p-6 shadow-2xl">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot" /> Prochains créneaux disponibles
      </h3>
      <ul className="space-y-2 mb-4">
        {items.map(({ id, c }) => (
          <li key={id}>
            <Link to={`/rdv?service=${id}&medecin=${c.medecinId}&date=${c.date}&heure=${c.heure}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-teal hover:bg-teal-light/40 transition-colors">
              <span>
                <span className="block font-semibold text-sm">{specialite(id).emoji} {specialite(id).nom}</span>
                <span className="block text-xs text-slate-400">{employe(s, c.medecinId)?.nom}</span>
              </span>
              <span className="text-right text-sm font-bold text-teal whitespace-nowrap">
                {c.date === auj ? "Aujourd'hui" : c.date === demain ? 'Demain' : fmtCourt(c.date)}<br />{fmtHeure(c.heure)}
              </span>
            </Link>
          </li>
        ))}
        {!items.length && <li className="text-sm text-slate-400">Aucun créneau dans les prochains jours — appelez-nous.</li>}
      </ul>
      <Link to="/rdv" className="block text-center py-3 bg-teal hover:bg-teal-dark text-white font-semibold rounded-xl transition-colors">
        Voir toutes les disponibilités
      </Link>
    </div>
  )
}
