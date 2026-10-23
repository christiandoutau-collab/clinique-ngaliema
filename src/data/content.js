export const CONTACT = {
  tel1: '+243 810 044 920',
  tel1Raw: '+243810044920',
  tel2: '+243 815 293 268',
  tel2Raw: '+243815293268',
  email: 'contact@cliniquengaliema.org',
  addressLine1: 'Avenue Papa ILEO, ex des Cliniques',
  addressLine2: 'C/ Gombe – Kinshasa, RDCongo',
  addressLine3: 'B.P : 3089',
  facebook: 'https://facebook.com/clinique.ngaliema',
  maps: 'https://www.google.com/maps/search/Clinique+Ngaliema+Kinshasa',
}

export const SERVICES = [
  {
    id: 'accueil',
    color: 'blue',
    emoji: '🏥',
    title: "Structure d'accueil",
    items: [
      'Urgences 24 heures sur 24',
      'Consultations externes : 8h00 – 15h30',
      'Du Lundi au Vendredi',
      'Accueil et orientation des patients',
    ],
    description: "Notre structure d'accueil est conçue pour recevoir et orienter chaque patient dans les meilleures conditions, avec une prise en charge rapide des urgences.",
  },
  {
    id: 'hospitaliers',
    color: 'teal',
    emoji: '🩺',
    title: 'Services hospitaliers',
    items: [
      'Médecine interne',
      'Pavillon chirurgie',
      'Hospitalisation complète',
      'Suivi post-opératoire',
    ],
    description: "Nos services hospitaliers disposent d'une équipe médicale spécialisée pour votre prise en charge complète, de l'admission jusqu'au retour à domicile.",
  },
  {
    id: 'plateau',
    color: 'gold',
    emoji: '🔬',
    title: 'Plateau technique',
    items: [
      'Scanner (Tomodensitométrie)',
      'Radiographie numérique fixe et mobile',
      'Échographie',
      "Laboratoire d'analyses",
    ],
    description: "Un plateau technique moderne avec des équipements de pointe pour un diagnostic précis et rapide au service de votre santé.",
  },
  {
    id: 'base',
    color: 'red',
    emoji: '🏠',
    title: 'Services de base',
    items: [
      'Cuisine & restauration patients',
      'Buanderie hospitalière',
      'Morgue moderne (12 tiroirs)',
      'Services logistiques internes',
    ],
    description: "Des services de soutien essentiels pour assurer le confort et la dignité de tous les patients et leurs familles.",
  },
]

export const PLATEAU_ITEMS = [
  { label: 'Scanner (Tomodensitométrie)', emoji: '🖥️' },
  { label: 'Radiographie numérique fixe', emoji: '📡' },
  { label: 'Radiographie mobile',         emoji: '🚗' },
  { label: 'Échographie',                 emoji: '🔊' },
  { label: "Laboratoire d'analyses",      emoji: '🧪' },
  { label: 'Bloc opératoire',             emoji: '✂️' },
  { label: 'Pharmacie interne',           emoji: '💊' },
  { label: 'Électrocardiogramme (ECG)',   emoji: '❤️' },
  { label: 'Soins intensifs',             emoji: '🫁' },
]

export const STATS = [
  { num: '1927', label: 'Fondée en' },
  { num: '24/7', label: 'Urgences ouvertes' },
  { num: '+97', label: "Ans d'expérience" },
  { num: '12', label: 'Tiroirs morgue moderne' },
]

export const NAV_LINKS = [
  { label: 'Accueil',           path: '/' },
  { label: 'Présentation',      path: '/presentation' },
  { label: 'Services',          path: '/services' },
  { label: 'Plateau technique', path: '/plateau' },
  { label: 'Nouvelles',         path: '/nouvelles' },
  { label: 'Galerie',           path: '/galerie' },
  { label: 'Contacts',          path: '/contacts' },
]

export const NEWS = [
  {
    id: 1,
    date: '2024-03-15',
    title: 'Nouvelles acquisitions en imagerie médicale',
    excerpt: "La Clinique Ngaliema renforce son plateau technique avec l'acquisition d'un nouveau scanner de dernière génération pour améliorer la qualité du diagnostic.",
    category: 'Équipement',
    color: 'teal',
  },
  {
    id: 2,
    date: '2024-02-20',
    title: 'Journée de sensibilisation au diabète',
    excerpt: "Notre équipe médicale organise une journée de dépistage gratuit et de sensibilisation au diabète pour la population de Kinshasa.",
    category: 'Événement',
    color: 'blue',
  },
  {
    id: 3,
    date: '2024-01-10',
    title: "Renforcement de l'équipe chirurgicale",
    excerpt: "La clinique accueille deux nouveaux chirurgiens spécialistes pour renforcer son service de chirurgie générale et orthopédique.",
    category: 'Personnel',
    color: 'gold',
  },
]

export const GALLERY = [
  { id: 1, label: 'Bâtiment principal',    bg: 'from-blue-deep to-blue-mid' },
  { id: 2, label: 'Salle de consultation', bg: 'from-teal to-teal-dark' },
  { id: 3, label: 'Bloc opératoire',       bg: 'from-blue-mid to-blue-bright' },
  { id: 4, label: 'Laboratoire',           bg: 'from-blue-bright to-teal' },
  { id: 5, label: 'Salle de radiologie',   bg: 'from-teal-dark to-blue-deep' },
  { id: 6, label: 'Accueil patients',      bg: 'from-blue-deep to-blue-bright' },
]
