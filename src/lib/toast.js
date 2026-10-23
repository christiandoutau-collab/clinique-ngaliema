// Notifications éphémères : toast('message') depuis n'importe quel composant.
const abonnes = new Set()

export function toast(message) {
  abonnes.forEach((fn) => fn(message))
}

export function onToast(fn) {
  abonnes.add(fn)
  return () => abonnes.delete(fn)
}
