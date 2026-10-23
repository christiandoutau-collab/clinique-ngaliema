import { useSyncExternalStore } from 'react'
import { subscribe, getSnapshot } from '../lib/clinique'

// État partagé (personnel, planning, rendez-vous) ; re-rend le composant à chaque modification.
export function useClinique() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
