import { Link, useSearchParams } from 'react-router-dom'
import GestionGalerie from '../components/GestionGalerie'

// Page dédiée à l'ajout / au retrait des photos de la galerie, sans le reste de l'espace personnel.
// L'accès est protégé par le code de la galerie (vérifié côté serveur).
// /galerie/gerer?categorie=bloc-operatoire présélectionne la catégorie.
export default function GererGalerie() {
  const [params] = useSearchParams()
  const categorie = params.get('categorie') ?? ''
  return (
    <section className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4">
        <Link to={categorie ? `/galerie/${categorie}` : '/galerie'} className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark mb-4">
          ← Retour à la galerie
        </Link>
        <h1 className="font-display text-3xl text-blue-deep mb-2">Photos de la galerie</h1>
        <p className="text-slate-500 text-sm mb-6">Choisissez une catégorie, puis ajoutez ou retirez ses photos.</p>
        <GestionGalerie categorieInitiale={categorie} />
      </div>
    </section>
  )
}
