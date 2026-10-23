// Galerie photos de la clinique, stockée sur Vercel Blob.
//   GET    /api/galerie                         → liste publique des photos
//   POST   /api/galerie { code, action: 'verifier' } → vérifie le code du personnel
//   POST   /api/galerie { code, image, legende } → ajoute une photo (image = data URL)
//   DELETE /api/galerie { code, url }           → supprime une photo
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   BLOB_STORE_ID (ou BLOB_READ_WRITE_TOKEN pour les anciens stores) : ajoutée automatiquement
//                         en connectant un store Blob *public* au projet ; @vercel/blob s'authentifie seul
//   CODE_GALERIE          : code secret que le personnel saisit pour gérer la galerie
import { put, list, del } from '@vercel/blob'
import { randomBytes, timingSafeEqual } from 'node:crypto'

const PREFIXE = 'galerie/'
const TYPES = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' }
const TAILLE_MAX = 3 * 1024 * 1024 // les photos sont réduites dans le navigateur avant envoi
const LEGENDE_MAX = 80

// La légende est encodée dans le nom du fichier : pas de base de données à tenir à jour.
// Format : galerie/<horodatage>-<aléa>--<légende en base64url>.<ext>
const encoder = (s) => Buffer.from(s, 'utf8').toString('base64url')
const decoder = (s) => Buffer.from(s, 'base64url').toString('utf8')

function versPhoto(blob) {
  const nom = blob.pathname.slice(PREFIXE.length).replace(/\.[a-z]+$/, '')
  const legende = nom.includes('--') ? decoder(nom.split('--')[1]) : ''
  return { url: blob.url, legende, date: new Date(blob.uploadedAt).toISOString() }
}

function codeValide(code) {
  const attendu = process.env.CODE_GALERIE
  if (!attendu || typeof code !== 'string') return false
  const a = Buffer.from(code)
  const b = Buffer.from(attendu)
  return a.length === b.length && timingSafeEqual(a, b)
}

// N'accepte que des URL de photos de la galerie de ce store
function urlDeLaGalerie(url) {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com') && u.pathname.startsWith(`/${PREFIXE}`)
  } catch {
    return false
  }
}

async function listerPhotos() {
  const photos = []
  let cursor
  do {
    const page = await list({ prefix: PREFIXE, cursor, limit: 1000 })
    photos.push(...page.blobs.map(versPhoto))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return photos.sort((a, b) => b.date.localeCompare(a.date))
}

export default async function handler(req, res) {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ erreur: 'stockage-non-configure' })
  }

  try {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
      return res.status(200).json({ photos: await listerPhotos() })
    }

    if (req.method !== 'POST' && req.method !== 'DELETE') {
      res.setHeader('Allow', 'GET, POST, DELETE')
      return res.status(405).json({ erreur: 'methode-non-autorisee' })
    }

    if (!process.env.CODE_GALERIE) return res.status(503).json({ erreur: 'code-non-configure' })
    const corps = req.body || {}
    if (!codeValide(corps.code)) return res.status(401).json({ erreur: 'code-invalide' })

    if (req.method === 'DELETE') {
      if (!urlDeLaGalerie(corps.url)) return res.status(400).json({ erreur: 'url-invalide' })
      await del(corps.url)
      return res.status(200).json({ ok: true })
    }

    if (corps.action === 'verifier') return res.status(200).json({ ok: true })

    const m = /^data:(image\/(?:jpeg|webp|png));base64,([A-Za-z0-9+/=]+)$/.exec(corps.image || '')
    if (!m) return res.status(400).json({ erreur: 'image-invalide' })
    const contenu = Buffer.from(m[2], 'base64')
    if (contenu.length > TAILLE_MAX) return res.status(413).json({ erreur: 'image-trop-lourde' })

    const legende = String(corps.legende ?? '').trim().slice(0, LEGENDE_MAX)
    const chemin = `${PREFIXE}${Date.now()}-${randomBytes(4).toString('hex')}--${encoder(legende)}.${TYPES[m[1]]}`
    const blob = await put(chemin, contenu, { access: 'public', contentType: m[1], addRandomSuffix: false })
    return res.status(201).json({ photo: versPhoto({ ...blob, uploadedAt: new Date() }) })
  } catch (e) {
    console.error('api/galerie', e)
    return res.status(500).json({ erreur: 'erreur-serveur' })
  }
}
