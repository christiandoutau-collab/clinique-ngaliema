import { Link } from 'react-router-dom'
import GestionGalerie from '../components/GestionGalerie'

// Page dédiée à l'ajout / au retrait des photos de la galerie, sans le reste de l'espace personnel.
// L'accès est protégé par le code de la galerie (vérifié côté serveur).
export default function GererGalerie() {
  return (
    <section className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/galerie" className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark mb-4">
          ← Retour à la galerie
        </Link>
        <h1 className="font-display text-3xl text-blue-deep mb-2">Photos de la galerie</h1>
        <p className="text-slate-500 text-sm mb-6">Ajoutez ou retirez les photos affichées sur la page Galerie du site.</p>
        <GestionGalerie />
      </div>
    </section>
  )
}
