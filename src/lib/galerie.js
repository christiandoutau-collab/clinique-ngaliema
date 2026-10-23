// Accès à la galerie photos (fonction serveur /api/galerie, stockage Vercel Blob).

const API = '/api/galerie'
const COTE_MAX = 1600 // px : suffisant pour l'affichage plein écran, léger à charger
const QUALITE = 0.82

const MESSAGES = {
  'stockage-non-configure': "Le stockage des photos n'est pas encore activé sur Vercel (Storage → Blob).",
  'code-non-configure': "Le code de la galerie n'est pas encore défini sur Vercel (variable CODE_GALERIE).",
  'code-invalide': 'Code de la galerie incorrect.',
  'image-invalide': "Ce fichier n'est pas une image prise en charge (JPG, PNG ou WebP).",
  'image-trop-lourde': 'Image trop lourde, même après réduction.',
  'url-invalide': 'Photo introuvable.',
  'categorie-invalide': 'Choisissez la catégorie de la photo.',
}

export class ErreurGalerie extends Error {
  constructor(message, code = '') {
    super(message)
    this.code = code
  }
}

async function appeler(methode, corps, frais = false) {
  let reponse
  try {
    reponse = await fetch(frais ? `${API}?t=${Date.now()}` : API, {
      method: methode,
      headers: corps ? { 'Content-Type': 'application/json' } : undefined,
      body: corps ? JSON.stringify(corps) : undefined,
    })
  } catch {
    throw new ErreurGalerie('Connexion impossible. Vérifiez votre réseau.')
  }
  const donnees = await reponse.json().catch(() => null)
  if (!donnees) throw new ErreurGalerie('Galerie indisponible (le site doit être hébergé sur Vercel).')
  if (!reponse.ok) throw new ErreurGalerie(MESSAGES[donnees.erreur] ?? 'Une erreur est survenue, réessayez.', donnees.erreur)
  return donnees
}

// frais = true contourne le cache serveur (30 s) : utile juste après un ajout ou une suppression
export async function chargerPhotos({ frais = false } = {}) {
  return (await appeler('GET', null, frais)).photos
}

export async function verifierCode(code) {
  await appeler('POST', { code, action: 'verifier' })
}

export async function ajouterPhoto(code, categorie, fichier, legende) {
  const image = await reduireImage(fichier)
  return (await appeler('POST', { code, categorie, image, legende })).photo
}

export async function supprimerPhoto(code, url) {
  await appeler('DELETE', { code, url })
}

// Redimensionne et recompresse en JPEG (respecte l'orientation des photos de téléphone).
async function reduireImage(fichier) {
  let source
  try {
    source = await createImageBitmap(fichier, { imageOrientation: 'from-image' })
  } catch {
    throw new ErreurGalerie(`« ${fichier.name} » n'a pas pu être lu. Utilisez une photo JPG ou PNG.`)
  }
  const echelle = Math.min(1, COTE_MAX / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(source.width * echelle)
  canvas.height = Math.round(source.height * echelle)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff' // fond blanc pour les PNG transparents
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  source.close?.()
  return canvas.toDataURL('image/jpeg', QUALITE)
}
