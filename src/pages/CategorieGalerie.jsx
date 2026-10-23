import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Visionneuse from '../components/Visionneuse'
import { chargerPhotos } from '../lib/galerie'
import { CATEGORIES_GALERIE, categorieGalerie } from '../data/galerie'

// Page d'une catégorie de la galerie (ex. /galerie/bloc-operatoire) : description + photos.
export default function CategorieGalerie() {
  const { categorie: id } = useParams()
  const categorie = categorieGalerie(id)
  const [photos, setPhotos] = useState(null)
  const [ouverte, setOuverte] = useState(null)
  const fermer = useCallback(() => setOuverte(null), [])

  useEffect(() => {
    chargerPhotos()
      .then((toutes) => setPhotos(toutes.filter((p) => p.categorie === id)))
      .catch(() => setPhotos([]))
  }, [id])

  if (!categorie) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="font-display text-3xl text-blue-deep mb-3">Catégorie introuvable</h1>
        <Link to="/galerie" className="text-teal font-semibold">← Retour à la galerie</Link>
      </div>
    )
  }

  const autres = CATEGORIES_GALERIE.filter((c) => c.id !== id)

  return (
    <>
      <section className={`bg-gradient-to-br ${categorie.from} ${categorie.to} text-white py-14`}>
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-5" aria-label="Fil d'Ariane">
            <Link to="/galerie" className="hover:text-white">Galerie</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{categorie.label}</span>
          </nav>
          <div className="flex items-start gap-5">
            <span className="hidden sm:flex w-20 h-20 rounded-2xl bg-white/15 items-center justify-center text-5xl flex-shrink-0">{categorie.emoji}</span>
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-5xl mb-4">{categorie.label}</h1>
              <p className="text-white/85 text-lg leading-relaxed">{categorie.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl text-blue-deep">
              Photos {photos?.length > 0 && <span className="text-slate-400 text-lg">({photos.length})</span>}
            </h2>
          </div>

          {photos === null && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true">
              {Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-square rounded-2xl bg-slate-200 animate-pulse" />)}
            </div>
          )}

          {photos?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((p, i) => (
                <button key={p.url} onClick={() => setOuverte(i)} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 text-left">
                  <img src={p.url} alt={p.legende || categorie.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.legende && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs sm:text-sm font-medium px-3 pt-8 pb-2.5">{p.legende}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {photos?.length === 0 && (
            <div className="text-center bg-white rounded-2xl p-10 border border-dashed border-slate-300">
              <p className="text-5xl mb-3">{categorie.emoji}</p>
              <h3 className="font-bold text-blue-deep mb-1">Photos bientôt disponibles</h3>
              <p className="text-slate-400 text-sm">Les photos de cet espace seront publiées prochainement.</p>
            </div>
          )}

          <p className="mt-6 text-center">
            <Link to={`/galerie/gerer?categorie=${id}`} className="text-xs font-semibold text-slate-400 hover:text-teal">
              📷 Ajouter des photos à « {categorie.label} » (personnel)
            </Link>
          </p>

          <h2 className="font-display text-2xl text-blue-deep mt-14 mb-5">Découvrir aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {autres.map((c) => (
              <Link key={c.id} to={`/galerie/${c.id}`}
                className={`bg-gradient-to-br ${c.from} ${c.to} rounded-xl p-4 text-white flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all`}>
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-sm font-semibold leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {photos?.length > 0 && ouverte !== null && <Visionneuse photos={photos} index={ouverte} changer={setOuverte} fermer={fermer} />}
    </>
  )
}
