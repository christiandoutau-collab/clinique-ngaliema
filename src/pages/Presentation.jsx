import { Link } from 'react-router-dom'
import { useReveal, revealRef } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'

const timeline = [
  { year: '1927', title: 'Fondation', desc: "La Clinique Ngaliema est fondée à Kinshasa (alors Léopoldville) comme institution de soins de santé publique au service de toute la population." },
  { year: '1960', title: 'Indépendance', desc: "Lors de l'indépendance de la RDC, la clinique affirme son rôle d'hôpital provincial de référence pour la capitale Kinshasa." },
  { year: '1990', title: 'Modernisation', desc: "Introduction du plateau technique moderne avec les premiers équipements d'imagerie médicale numérique." },
  { year: '2000', title: 'Expansion', desc: "Agrandissement des pavillons hospitaliers et renforcement de l'équipe médicale spécialisée." },
  { year: '2019', title: 'Numérique', desc: "Mise en place du système de radiographie numérique et du scanner de dernière génération." },
  { year: '2024', title: "Aujourd'hui", desc: "La clinique continue d'innover pour offrir les meilleurs soins à la population de Kinshasa et de toute la RDCongo." },
]

const values = [
  { emoji: '❤️', title: 'Humanisme',    desc: "Chaque patient est accueilli avec respect, dignité et bienveillance, quelles que soient ses origines." },
  { emoji: '🎯', title: 'Excellence',   desc: "Nous visons en permanence la qualité maximale dans nos soins, nos équipements et nos pratiques." },
  { emoji: '🤝', title: 'Accessibilité', desc: "Des soins de qualité accessibles à tous, conformément à notre mission de service public." },
  { emoji: '🔬', title: 'Innovation',   desc: "Nous investissons continuellement dans les technologies et formations médicales les plus récentes." },
]

function TimelineItem({ item, index }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="section-reveal flex gap-6" style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {item.year}
        </div>
        {index < timeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
      </div>
      <div className="pb-10">
        <h3 className="font-bold text-blue-deep text-lg">{item.title}</h3>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

export default function Presentation() {
  const bannerRef = useReveal()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-deep to-blue-mid text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div ref={bannerRef} className="section-reveal max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-teal mb-3">Qui sommes-nous</p>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Notre présentation</h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Depuis 1927, la Clinique Ngaliema est au cœur de la santé publique à Kinshasa,
              servant des générations de familles congolaises avec dévouement.
            </p>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeader
                label="Notre histoire"
                title="Près d'un siècle de soins"
                desc="La Clinique Ngaliema est l'une des plus anciennes institutions médicales de la République Démocratique du Congo."
              />
              <p className="text-slate-500 leading-relaxed mb-4">
                Fondée en 1927, la Clinique Ngaliema a su traverser les décennies en restant fidèle à sa mission première :
                offrir des soins de santé de qualité à tous les habitants de Kinshasa et de ses environs.
              </p>
              <p className="text-slate-500 leading-relaxed mb-4">
                Service public depuis son origine, l'établissement a su se mettre à la disposition des habitants
                de la ville de Kinshasa et même des étrangers pour leurs besoins sanitaires, fidèle à sa vocation
                d'hôpital général provincial de référence secondaire.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Aujourd'hui, la clinique continue de moderniser ses équipements et de former son personnel
                pour maintenir le niveau d'excellence que les patients de Kinshasa méritent.
              </p>
            </div>

            {/* Timeline */}
            <div className="pt-4">
              {timeline.map((item, i) => (
                <TimelineItem key={item.year} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader label="Nos engagements" title="Vision & Mission" center />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                emoji: '🎯',
                title: 'Notre Vision',
                color: 'border-teal',
                bg: 'bg-teal-light',
                content: '"Tout satisfaire et Tous satisfaire" — Une vision claire au service de chaque patient. Nous aspirons à être l\'hôpital de référence incontournable de Kinshasa, reconnu pour l\'excellence de ses soins et l\'humanité de son accueil.',
              },
              {
                emoji: '🏥',
                title: 'Notre Mission',
                color: 'border-blue-bright',
                bg: 'bg-blue-50',
                content: 'Fournir des soins médicaux de qualité, accessibles à toute la population de Kinshasa et de la RDCongo, dans le respect de la dignité humaine, avec des équipements modernes et une équipe médicale qualifiée et dévouée.',
              },
            ].map((item) => {
              return (
                <div key={item.title} ref={revealRef} className={`section-reveal bg-white rounded-2xl p-8 border-l-4 ${item.color} shadow-sm`}>
                  <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center text-3xl mb-5`}>{item.emoji}</div>
                  <h3 className="font-bold text-blue-deep text-xl mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.content}</p>
                </div>
              )
            })}
          </div>

          {/* Valeurs */}
          <SectionHeader label="Ce qui nous guide" title="Nos valeurs" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              return (
                <div key={v.title} ref={revealRef} className="section-reveal text-center bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="text-4xl mb-4">{v.emoji}</div>
                  <h4 className="font-bold text-blue-deep mb-2">{v.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-br from-blue-deep to-blue-mid text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-display text-3xl mb-4">Venez nous rendre visite</h2>
          <p className="text-white/70 mb-8">Découvrez nos installations et rencontrez notre équipe médicale dévouée.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contacts" className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-3 rounded-xl transition-all">
              📍 Nous localiser
            </Link>
            <Link to="/rdv" className="border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
              📅 Prendre un RDV
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
