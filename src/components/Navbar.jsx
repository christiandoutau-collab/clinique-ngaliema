import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/content'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Ferme le menu mobile au changement de page (ajustement pendant le rendu plutôt que dans un effet)
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) { setPrevPath(pathname); setOpen(false) }

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-bright to-teal flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🏥</span>
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-blue-deep text-sm group-hover:text-blue-bright transition-colors">
                Clinique Ngaliema
              </span>
              <span className="block text-slate-400 text-xs max-w-[200px] leading-tight">
                Hôp. Gén. Prov. de Réf. Secondaire
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === path
                      ? 'bg-slate-100 text-blue-bright'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-blue-bright'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/rdv"
                className="ml-2 px-4 py-2 bg-teal text-white rounded-lg text-sm font-semibold hover:bg-teal-dark transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                📅 Prendre RDV
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-blue-deep rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-blue-deep rounded transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-blue-deep rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-blue-deep/95 backdrop-blur-sm flex flex-col items-center justify-center gap-5 transition-all duration-300 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button className="absolute top-5 right-5 text-white text-3xl" onClick={() => setOpen(false)}>✕</button>
        {NAV_LINKS.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setOpen(false)}
            className={`text-2xl font-medium transition-colors ${pathname === path ? 'text-teal' : 'text-white hover:text-teal'}`}
          >
            {label}
          </Link>
        ))}
        <Link
          to="/rdv"
          onClick={() => setOpen(false)}
          className="mt-4 px-8 py-3 bg-teal text-white rounded-xl text-xl font-bold hover:bg-teal-dark transition-colors"
        >
          📅 Prendre RDV
        </Link>
      </div>
    </>
  )
}
