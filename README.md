# Clinique Ngaliema — refonte du site

Prototype modernisé du site de la Clinique Ngaliema (Kinshasa) avec :

- **Site public** : accueil, 14 spécialités avec recherche, infos patients & visiteurs, urgences, contact.
- **Prise de rendez-vous en 4 étapes** : spécialité → médecin (ou « premier disponible ») → date & créneau → coordonnées.
  - Les créneaux proposés dépendent **du planning réel des médecins** (un médecin en repos/congé n'est pas réservable).
  - Confirmation immédiate avec code de réservation (`CN-XXXXX`), ajout à l'agenda (.ics), impression.
  - Raccourci « prochains créneaux disponibles » sur l'accueil.
- **Mon rendez-vous** : le patient retrouve ou annule son RDV avec son code et son téléphone (le créneau est libéré).
- **Espace personnel** (code de démo : `1927`) :
  - **Planning hebdomadaire** de tout le personnel (matin, après-midi, nuit, journée, garde 24 h, repos, congé), modifiable d'un clic.
  - Rotation automatique par défaut, modifications manuelles signalées.
  - Alertes : repos insuffisant après une nuit ou une garde, dépassement de 48 h/semaine, nuits sous-dotées (< 2 soignants).
  - Filtres par fonction et service, export CSV, impression.
  - **Rendez-vous du jour** : suivi du statut (confirmé, arrivé, terminé, absent, annulé), alerte si le médecin n'est plus planifié.
  - **Équipe** : ajout et retrait de membres (les médecins ajoutés deviennent réservables).

## Lancer

Aucune installation : ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
npx serve clinique-ngaliema
```

## À savoir avant une mise en production

- Les **noms du personnel, les patients et les horaires** sont des données de démonstration : à remplacer
  par les vraies données (constantes `CONFIG` et `EQUIPE_DEMO` en haut de `app.js`).
- Les données sont stockées dans le **navigateur** (`localStorage`). Pour un usage réel sur plusieurs postes,
  remplacer l'objet `db` de `app.js` par un backend (Supabase, API…) et l'accès par code par une vraie
  authentification du personnel.
- Les envois de SMS/e-mails de confirmation et de rappel ne sont pas branchés.
