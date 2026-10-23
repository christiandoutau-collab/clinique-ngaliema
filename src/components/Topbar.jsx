import { CONTACT } from '../data/content'

export default function Topbar() {
  return (
    <div className="bg-blue-deep text-slate-400 text-xs py-2">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
        <span className="hidden sm:block">Hôpital Général Provincial de Référence Secondaire — Kinshasa, RDCongo</span>
        <div className="flex items-center gap-5">
          <a href={`tel:${CONTACT.tel1Raw}`} className="hover:text-white transition-colors flex items-center gap-1">
            📞 {CONTACT.tel1}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors hidden md:flex items-center gap-1">
            ✉️ {CONTACT.email}
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            Facebook
          </a>
        </div>
      </div>
    </div>
  )
}
