import { Routes, Route } from 'react-router-dom'
import Topbar from './components/Topbar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Accueil from './pages/Accueil'
import Presentation from './pages/Presentation'
import Services from './pages/Services'
import { Plateau, Nouvelles, Galerie, Contacts, RDV } from './pages/OtherPages'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Accueil />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/services"     element={<Services />} />
        <Route path="/plateau"      element={<Plateau />} />
        <Route path="/nouvelles"    element={<Nouvelles />} />
        <Route path="/galerie"      element={<Galerie />} />
        <Route path="/contacts"     element={<Contacts />} />
        <Route path="/rdv"          element={<RDV />} />
        <Route path="*"             element={
          <div className="min-h-96 flex flex-col items-center justify-center text-center px-4">
            <p className="text-7xl mb-5">🏥</p>
            <h1 className="font-display text-4xl text-blue-deep mb-3">Page introuvable</h1>
            <p className="text-slate-500 mb-8">La page que vous cherchez n'existe pas.</p>
            <a href="/" className="bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">
              Retour à l'accueil
            </a>
          </div>
        } />
      </Routes>
    </Layout>
  )
}
