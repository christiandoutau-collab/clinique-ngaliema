// Catégories de la galerie photos. Partagé entre le site et la fonction serveur api/galerie.js :
// une photo ne peut être publiée que dans l'une de ces catégories.
// Les descriptions sont des textes de présentation à relire / compléter par la clinique.

export const CATEGORIES_GALERIE = [
  {
    id: 'batiment-principal',
    label: 'Bâtiment principal',
    emoji: '🏛️',
    from: 'from-blue-deep', to: 'to-blue-mid',
    description: "Le bâtiment principal de la Clinique Ngaliema, avenue Papa Ileo dans la commune de la Gombe, accueille les patients de Kinshasa depuis 1927. Il regroupe l'accueil, les consultations externes et l'administration.",
  },
  {
    id: 'salle-consultation',
    label: 'Salle de consultation',
    emoji: '🩺',
    from: 'from-teal', to: 'to-teal-dark',
    description: "Les salles de consultation reçoivent les patients du lundi au vendredi, de 8h00 à 15h30, pour les consultations de médecine générale et de spécialités. Les rendez-vous peuvent être pris en ligne.",
  },
  {
    id: 'bloc-operatoire',
    label: 'Bloc opératoire',
    emoji: '🔦',
    from: 'from-blue-mid', to: 'to-blue-bright',
    description: "Le bloc opératoire accueille les interventions chirurgicales programmées et urgentes, avec une équipe de chirurgiens et d'anesthésistes-réanimateurs.",
  },
  {
    id: 'laboratoire',
    label: 'Laboratoire',
    emoji: '🧪',
    from: 'from-blue-bright', to: 'to-teal',
    description: "Le laboratoire d'analyses biologiques réalise les examens prescrits par les médecins de la clinique et aide à orienter rapidement le diagnostic.",
  },
  {
    id: 'radiologie',
    label: 'Salle de radiologie',
    emoji: '📡',
    from: 'from-teal-dark', to: 'to-blue-deep',
    description: "Le service d'imagerie médicale regroupe la radiographie numérique, l'échographie et le scanner pour des diagnostics précis.",
  },
  {
    id: 'accueil-patients',
    label: 'Accueil patients',
    emoji: '👋',
    from: 'from-blue-deep', to: 'to-blue-bright',
    description: "L'accueil oriente les patients et leurs proches dès leur arrivée. Pensez à vous présenter 15 minutes avant votre rendez-vous avec votre code de réservation.",
  },
  {
    id: 'pharmacie',
    label: 'Pharmacie',
    emoji: '💊',
    from: 'from-teal', to: 'to-blue-mid',
    description: "La pharmacie interne délivre les médicaments prescrits aux patients hospitalisés et en consultation.",
  },
  {
    id: 'pavillon-chirurgie',
    label: 'Pavillon chirurgie',
    emoji: '✂️',
    from: 'from-blue-bright', to: 'to-blue-deep',
    description: "Le pavillon de chirurgie accueille les patients avant et après leur intervention, pour une hospitalisation et un suivi post-opératoire attentifs.",
  },
]

export const IDS_CATEGORIES = CATEGORIES_GALERIE.map((c) => c.id)
export const categorieGalerie = (id) => CATEGORIES_GALERIE.find((c) => c.id === id)
