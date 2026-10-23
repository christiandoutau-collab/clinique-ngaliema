# Clinique Ngaliema — site web

Site de la Clinique Ngaliema (Kinshasa) : React 19 + Vite + Tailwind CSS.

## Fonctionnalités

**Site public** : accueil, présentation, services, plateau technique, nouvelles, galerie, contacts.

**Prise de rendez-vous en 4 étapes** (`/rdv`) : spécialité → médecin (ou « premier disponible ») → date et créneau → coordonnées.
- Les créneaux proposés viennent du **planning réel des médecins** (un médecin en repos ou en congé n'est pas réservable),
  par tranches de 30 min pendant les consultations externes (8h00 – 15h30, du lundi au vendredi).
- Confirmation immédiate avec un code `CN-XXXXX`, ajout à l'agenda (.ics avec rappel 2 h avant), impression.
- « Prochains créneaux disponibles » sur l'accueil : un clic mène directement à l'étape des coordonnées.

**Mon rendez-vous** (`/mon-rdv`) : retrouver ou annuler son RDV avec son code et son téléphone (le créneau est libéré).

**Espace personnel** (`/personnel`, code de démonstration `1927`) :
- **Planning** hebdomadaire de tout le personnel (matin, après-midi, nuit, journée, garde 24 h, repos, congé), modifiable d'un clic ;
  rotation automatique par défaut, modifications manuelles signalées ; filtres, export CSV, impression.
- **Alertes** : repos insuffisant après une nuit ou une garde, plus de 48 h/semaine, nuit avec moins de 2 soignants,
  médecin passé en congé alors qu'il a des patients.
- **Rendez-vous du jour** avec suivi du statut (confirmé, arrivé, terminé, absent, annulé).
- **Équipe** : ajout et retrait de membres (les médecins ajoutés deviennent réservables).

## Développement

```bash
npm install
npm run dev     # http://localhost:5173
npm run lint
npm run build   # sortie dans dist/
```

Le site utilise des URL « propres » (`/rdv`, `/personnel`…) : l'hébergeur doit renvoyer `index.html`
pour toutes les routes (règle de réécriture SPA sur Vercel, Netlify, Nginx…).

## Organisation du code

- `src/lib/clinique.js` : logique métier (spécialités, planning, créneaux, rendez-vous) et stockage.
- `src/hooks/useClinique.js` : accès réactif aux données depuis les composants.
- `src/pages/RendezVous.jsx`, `MonRdv.jsx`, `Personnel.jsx` : les nouvelles pages.

## Avant une mise en production

- Les **noms du personnel et les patients** sont des données de démonstration (`EQUIPE_DEMO` dans `src/lib/clinique.js`).
- Les données sont stockées dans le **navigateur** (`localStorage`) : pour un usage réel sur plusieurs postes,
  brancher un backend (ex. Supabase) à la place de `charger`/`persister`, en gardant la même API.
- Remplacer le code d'accès du personnel par de vrais comptes (authentification).
- Les SMS / e-mails de confirmation et de rappel ne sont pas branchés.
