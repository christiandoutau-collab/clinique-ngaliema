import { Link } from 'react-router-dom'
import { CONTACT, NAV_LINKS } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-blue-deep text-slate-400">
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-bright to-teal flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <div>
                <span className="block font-bold text-white">Clinique Ngaliema</span>
                <span className="text-xs text-slate-500">Hôp. Gén. Prov. de Réf. Secondaire</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Institution de soins de santé publique à Kinshasa depuis 1927.
              Disponibilité et soins de qualité pour tous les habitants de la RDCongo.
            </p>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-teal rounded-lg text-white text-sm font-medium transition-colors"
            >
              f Facebook
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-sm hover:text-teal transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/rdv" className="text-sm text-teal hover:text-white transition-colors font-medium">
                  📅 Prendre un RDV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`tel:${CONTACT.tel1Raw}`} className="hover:text-teal transition-colors">
                  📞 {CONTACT.tel1}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.tel2Raw}`} className="hover:text-teal transition-colors">
                  📞 {CONTACT.tel2}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-teal transition-colors break-all">
                  ✉️ {CONTACT.email}
                </a>
              </li>
              <li className="pt-2 leading-relaxed">
                📍 {CONTACT.addressLine1}<br />
                {CONTACT.addressLine2}<br />
                {CONTACT.addressLine3}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>© 2024 – {new Date().getFullYear()} Clinique Ngaliema. Tous droits réservés.</span>
          <span>Conçu avec ❤️ pour votre santé</span>
        </div>
      </div>
    </footer>
  )
}
