import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from '../lib/toast'
import { chargerPhotos, verifierCode, ajouterPhoto, supprimerPhoto } from '../lib/galerie'

const CLE_CODE = 'cn_code_galerie'
const lireCode = () => { try { return sessionStorage.getItem(CLE_CODE) || '' } catch { return '' } }
const ecrireCode = (c) => { try { c ? sessionStorage.setItem(CLE_CODE, c) : sessionStorage.removeItem(CLE_CODE) } catch { /* mémoire seule */ } }

const champ = 'w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:border-teal'

export default function GestionGalerie() {
  const [code, setCode] = useState(lireCode)
  const [codeOk, setCodeOk] = useState(() => Boolean(lireCode()))
  const [photos, setPhotos] = useState(null)
  const [erreurListe, setErreurListe] = useState('')
  const [selection, setSelection] = useState([])
  const [envoi, setEnvoi] = useState(false)
  const apercus = useRef(new Set())

  useEffect(() => {
    chargerPhotos({ frais: true }).then(setPhotos).catch((e) => { setPhotos([]); setErreurListe(e.message) })
  }, [])

  // Libère les aperçus locaux en quittant l'onglet
  useEffect(() => {
    const urls = apercus.current
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  const retirerDeSelection = (id) => {
    setSelection((sel) => {
      const item = sel.find((x) => x.id === id)
      if (item) { URL.revokeObjectURL(item.apercu); apercus.current.delete(item.apercu) }
      return sel.filter((x) => x.id !== id)
    })
  }

  const valider = async (e) => {
    e.preventDefault()
    try {
      await verifierCode(code)
      ecrireCode(code)
      setCodeOk(true)
    } catch (err) {
      toast(err.message)
    }
  }

  const choisir = (e) => {
    const nouveaux = [...e.target.files].map((fichier) => {
      const apercu = URL.createObjectURL(fichier)
      apercus.current.add(apercu)
      return { id: `${fichier.name}-${fichier.lastModified}-${Math.random()}`, fichier, apercu, legende: '', etat: 'attente', message: '' }
    })
    setSelection((sel) => [...sel, ...nouveaux])
    e.target.value = ''
  }

  const majItem = (id, patch) => setSelection((sel) => sel.map((x) => (x.id === id ? { ...x, ...patch } : x)))

  const publier = async () => {
    setEnvoi(true)
    let reussies = 0
    for (const item of selection.filter((x) => x.etat !== 'ok')) {
      majItem(item.id, { etat: 'envoi', message: '' })
      try {
        const photo = await ajouterPhoto(code, item.fichier, item.legende)
        setPhotos((p) => [photo, ...(p ?? [])])
        retirerDeSelection(item.id)
        reussies++
      } catch (err) {
        majItem(item.id, { etat: 'erreur', message: err.message })
        if (err.code === 'code-invalide') { ecrireCode(''); setCodeOk(false); break }
      }
    }
    setEnvoi(false)
    if (reussies) toast(`${reussies} photo${reussies > 1 ? 's' : ''} publiée${reussies > 1 ? 's' : ''} dans la galerie.`)
  }

  const supprimer = async (photo) => {
    if (!confirm('Retirer cette photo de la galerie du site ?')) return
    try {
      await supprimerPhoto(code, photo.url)
      setPhotos((p) => p.filter((x) => x.url !== photo.url))
      toast('Photo retirée.')
    } catch (err) {
      toast(err.message)
    }
  }

  if (!codeOk) {
    return (
      <form onSubmit={valider} className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-blue-deep mb-1">Galerie photos du site</h3>
        <p className="text-sm text-slate-500 mb-4">Saisissez le code de la galerie (différent du code de l'espace personnel) pour ajouter ou retirer des photos.</p>
        <input type="password" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code de la galerie"
          autoComplete="off" className={champ} />
        <button className="w-full mt-3 py-2.5 bg-teal hover:bg-teal-dark text-white font-bold rounded-lg">Continuer</button>
        {erreurListe && <p className="mt-4 bg-amber-50 text-amber-800 rounded-lg p-3 text-xs">{erreurListe}</p>}
      </form>
    )
  }

  const enAttente = selection.filter((x) => x.etat !== 'ok').length

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="font-bold text-blue-deep">Ajouter des photos</h3>
          <span className="flex-1" />
          <Link to="/galerie" className="text-sm font-semibold text-teal">Voir la galerie du site →</Link>
        </div>

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-teal/40 bg-teal-light/30 hover:bg-teal-light/60 rounded-2xl p-8 cursor-pointer text-center transition-colors">
          <span className="text-4xl">📷</span>
          <span className="font-bold text-teal-dark">Choisir des photos</span>
          <span className="text-xs text-slate-500">Galerie du téléphone ou appareil photo · plusieurs à la fois · réduites automatiquement</span>
          <input type="file" accept="image/*" multiple onChange={choisir} className="sr-only" />
        </label>

        {selection.length > 0 && (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {selection.map((x) => (
                <li key={x.id} className={`flex gap-3 p-3 rounded-xl border-2 ${x.etat === 'erreur' ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                  <img src={x.apercu} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <input value={x.legende} onChange={(e) => majItem(x.id, { legende: e.target.value })} maxLength={80} disabled={x.etat === 'envoi'}
                      placeholder="Légende (ex. Bloc opératoire)" className={`${champ} py-2`} aria-label="Légende" />
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className={x.etat === 'erreur' ? 'text-red-600 font-semibold' : 'text-slate-400'}>
                        {x.etat === 'envoi' ? '⏳ Envoi…' : x.etat === 'erreur' ? x.message : 'Prête'}
                      </span>
                      {x.etat !== 'envoi' && (
                        <button onClick={() => retirerDeSelection(x.id)} className="text-slate-400 hover:text-red-600 font-semibold">Retirer</button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={publier} disabled={envoi || !enAttente}
              className="w-full sm:w-auto mt-4 px-6 py-3 bg-teal hover:bg-teal-dark disabled:opacity-50 text-white font-bold rounded-xl">
              {envoi ? 'Publication en cours…' : `Publier ${enAttente} photo${enAttente > 1 ? 's' : ''} sur le site`}
            </button>
          </>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-200">
          <strong className="text-blue-deep">Photos en ligne {photos && `(${photos.length})`}</strong>
          <button onClick={() => { ecrireCode(''); setCode(''); setCodeOk(false) }} className="text-xs font-semibold text-slate-400 hover:text-blue-deep">Verrouiller</button>
        </div>
        {photos === null && <p className="p-8 text-center text-slate-400">Chargement…</p>}
        {photos?.length === 0 && <p className="p-8 text-center text-slate-400">{erreurListe || 'Aucune photo pour le moment.'}</p>}
        {photos?.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
            {photos.map((p) => (
              <li key={p.url} className="group relative">
                <img src={p.url} alt={p.legende} loading="lazy" className="w-full aspect-square object-cover rounded-xl" />
                <span className="block text-xs text-slate-500 mt-1 truncate">{p.legende || 'Sans légende'}</span>
                <button onClick={() => supprimer(p)} aria-label={`Supprimer ${p.legende || 'la photo'}`}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-600 font-bold shadow hover:bg-red-50">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
