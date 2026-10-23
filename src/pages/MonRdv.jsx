import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useClinique } from '../hooks/useClinique'
import RecapRdv from '../components/RecapRdv'
import { toast } from '../lib/toast'
import { trouverRdv, changerStatut, exporterIcs, parseYmd, today } from '../lib/clinique'

const champ = 'w-full mt-1.5 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal'

export default function MonRdv() {
  const s = useClinique()
  const [params] = useSearchParams()
  const [code, setCode] = useState(params.get('code') ?? '')
  const [tel, setTel] = useState('')
  const [rdvId, setRdvId] = useState(null)
  const [introuvable, setIntrouvable] = useState(false)

  // Relu depuis l'état partagé pour refléter une annulation immédiatement
  const rdv = rdvId && s.rdvs.find((r) => r.id === rdvId)
  const modifiable = rdv && rdv.statut === 'confirme' && parseYmd(rdv.date) >= today()

  const chercher = (e) => {
    e.preventDefault()
    const r = trouverRdv(code, tel)
    setRdvId(r?.id ?? null)
    setIntrouvable(!r)
  }

  const annuler = () => {
    if (!confirm("Confirmer l'annulation de ce rendez-vous ?")) return
    changerStatut(rdv.id, 'annule')
    toast('Rendez-vous annulé. Le créneau est libéré pour un autre patient.')
  }

  return (
    <section className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 md:p-9 shadow-lg border border-slate-100">
          <h1 className="font-display text-3xl text-blue-deep mb-2">Mon rendez-vous</h1>
          <p className="text-slate-500 mb-6">Retrouvez, ajoutez à votre agenda ou annulez votre rendez-vous avec votre code de réservation.</p>
          <form onSubmit={chercher} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm font-semibold text-slate-700">Code de réservation
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="CN-XXXXX" autoComplete="off" className={champ} />
            </label>
            <label className="block text-sm font-semibold text-slate-700">Téléphone utilisé
              <input value={tel} onChange={(e) => setTel(e.target.value)} required type="tel" placeholder="+243 …" className={champ} />
            </label>
            <button type="submit" className="sm:col-span-2 py-3 bg-teal hover:bg-teal-dark text-white font-bold rounded-xl">Rechercher</button>
          </form>

          {introuvable && (
            <p className="mt-6 bg-amber-50 text-amber-800 rounded-xl p-4 text-sm">
              Aucun rendez-vous trouvé avec ce code et ce numéro. Vérifiez vos informations.
            </p>
          )}

          {rdv && (
            <div className="mt-4">
              <RecapRdv s={s} rdv={rdv} statut />
              {modifiable && (
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => exporterIcs(s, rdv)} className="px-4 py-2.5 border-2 border-slate-200 rounded-xl font-semibold text-sm text-slate-600 hover:border-teal hover:text-teal">📅 Ajouter à mon agenda</button>
                  <Link to={`/rdv?service=${rdv.serviceId}&medecin=${rdv.medecinId}`} className="px-4 py-2.5 border-2 border-slate-200 rounded-xl font-semibold text-sm text-slate-600 hover:border-teal hover:text-teal">Reprendre un autre créneau</Link>
                  <button onClick={annuler} className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold text-sm">Annuler ce rendez-vous</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
