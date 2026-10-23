/*
 * Clinique Ngaliema — site public, prise de rendez-vous et planning du personnel.
 *
 * Application statique sans dépendance : les données sont stockées dans le
 * localStorage du navigateur (couche `db` ci-dessous). Pour une mise en
 * production multi-postes, remplacer `db` par un backend (Supabase, API…)
 * en gardant les mêmes fonctions.
 */
(function () {
  'use strict';

  // ===================================================================
  // Configuration (à valider avec la direction de la clinique)
  // ===================================================================
  const CONFIG = {
    pinPersonnel: '1927', // code de démonstration de l'espace personnel
    dureeConsultation: 30, // minutes
    joursReservables: 21,
    heuresMaxSemaine: 48,
    horaires: [
      ['Urgences', '24h/24 — 7j/7'],
      ['Consultations (lun–ven)', '08h00 – 18h00'],
      ['Consultations (samedi)', 'Gardes uniquement'],
      ['Laboratoire', '07h00 – 19h00'],
      ['Visites aux patients', '12h00 – 14h00 · 17h00 – 19h00'],
    ],
  };

  // Plages de consultation selon le poste du médecin ce jour-là
  const PLAGES_CONSULT = {
    M: ['08:00', '13:30'],
    J: ['08:00', '15:30'],
    A: ['14:00', '18:00'],
  };

  const POSTES = {
    M: { label: 'Matin', h: '07h–14h', heures: 7 },
    A: { label: 'Après-midi', h: '14h–21h', heures: 7 },
    N: { label: 'Nuit', h: '21h–07h', heures: 10 },
    J: { label: 'Journée', h: '08h–16h', heures: 8 },
    G: { label: 'Garde 24h', h: '08h–08h', heures: 24 },
    R: { label: 'Repos', h: '', heures: 0 },
    C: { label: 'Congé', h: '', heures: 0 },
  };

  const ROLES = {
    medecin: { label: 'Médecin', couleur: '#0b6e6e' },
    infirmier: { label: 'Infirmier·ère', couleur: '#3b82c4' },
    technicien: { label: 'Technicien·ne', couleur: '#8a5cf6' },
    administratif: { label: 'Administratif', couleur: '#e8833a' },
  };

  const STATUTS = {
    confirme: 'Confirmé',
    arrive: 'Arrivé',
    termine: 'Terminé',
    absent: 'Absent',
    annule: 'Annulé',
  };

  // Icônes (tracés SVG 24×24, contour)
  const ICONS = {
    stetho: 'M4 3v6a5 5 0 0 0 10 0V3M9 14v1a5 5 0 0 0 10 0v-2M19 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
    femme: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 15v7M9 19h6',
    enfant: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0',
    bistouri: 'M14 4l6 6-9 9H5v-6zM12 6l6 6',
    os: 'M17 10c.7-.7 1.7-.6 2.4-.2a2 2 0 1 0-1.2-3 2 2 0 1 0-3-1.2c.4.7.5 1.7-.2 2.4l-7 7c-.7.7-1.7.6-2.4.2a2 2 0 1 0 1.2 3 2 2 0 1 0 3 1.2c-.4-.7-.5-1.7.2-2.4z',
    cerveau: 'M12 4a4 4 0 0 0-4 4 4 4 0 0 0-2 7.5A4 4 0 0 0 12 20a4 4 0 0 0 6-4.5A4 4 0 0 0 16 8a4 4 0 0 0-4-4zM12 4v16',
    goutte: 'M12 2.7l5.7 5.6a8 8 0 1 1-11.3 0z',
    psy: 'M12 3a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V21h8v-5.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7zM9 10a3 3 0 0 1 6 0',
    oeil: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    dent: 'M7 3C5 3 4 5 4 7c0 3 1 5 2 8s1 6 3 6 2-5 3-5 1 5 3 5 2-3 3-6 2-5 2-8c0-2-1-4-3-4s-3 1-5 1-3-1-5-1z',
    peau: 'M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15',
    pouls: 'M22 12h-4l-3 9L9 3l-3 9H2',
    oreille: 'M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4',
    avion: 'M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
    check: 'M5 12l5 5L20 7',
    x: 'M18 6L6 18M6 6l12 12',
    gauche: 'M15 18l-6-6 6-6',
    droite: 'M9 18l6-6-6-6',
  };
  const icon = (name, size = 24) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

  const SERVICES = [
    { id: 'medecine-interne', nom: 'Médecine interne', icon: 'stetho', desc: 'Diagnostic et suivi des maladies de l\'adulte : diabète, hypertension, infections.', mots: 'generaliste fievre paludisme diabete tension' },
    { id: 'gyneco', nom: 'Gynéco-obstétrique', icon: 'femme', desc: 'Suivi de grossesse, accouchement, santé de la femme.', mots: 'grossesse maternite accouchement femme' },
    { id: 'pediatrie', nom: 'Pédiatrie', icon: 'enfant', desc: 'Soins des nouveau-nés, enfants et adolescents, vaccinations.', mots: 'enfant bebe vaccin' },
    { id: 'chirurgie', nom: 'Chirurgie générale', icon: 'bistouri', desc: 'Interventions abdominales, hernies, chirurgie viscérale.', mots: 'operation ventre hernie' },
    { id: 'orthopedie', nom: 'Chirurgie orthopédique', icon: 'os', desc: 'Fractures, traumatologie, articulations et colonne.', mots: 'fracture os genou dos' },
    { id: 'neurochirurgie', nom: 'Neurochirurgie', icon: 'cerveau', desc: 'Pathologies chirurgicales du cerveau et de la moelle épinière.', mots: 'cerveau colonne nerf' },
    { id: 'urologie', nom: 'Urologie', icon: 'goutte', desc: 'Reins, vessie, prostate et appareil urinaire.', mots: 'prostate rein vessie' },
    { id: 'neuropsy', nom: 'Neuropsychiatrie', icon: 'psy', desc: 'Épilepsie, troubles neurologiques et santé mentale.', mots: 'psychiatre depression epilepsie mental' },
    { id: 'ophtalmo', nom: 'Ophtalmologie', icon: 'oeil', desc: 'Vue, lunettes, cataracte, glaucome.', mots: 'yeux vue lunettes cataracte' },
    { id: 'dentisterie', nom: 'Dentisterie', icon: 'dent', desc: 'Soins dentaires, détartrage, extractions.', mots: 'dents dentiste carie' },
    { id: 'dermato', nom: 'Dermatologie', icon: 'peau', desc: 'Peau, cheveux, ongles et maladies cutanées.', mots: 'peau bouton allergie' },
    { id: 'anesthesie', nom: 'Anesthésie-réanimation', icon: 'pouls', desc: 'Consultation pré-anesthésique avant une intervention.', mots: 'anesthesie operation reanimation' },
    { id: 'orl', nom: 'ORL', icon: 'oreille', desc: 'Oreilles, nez, gorge, audition.', mots: 'oreille nez gorge sinus' },
    { id: 'voyage', nom: 'Médecine de voyage', icon: 'avion', desc: 'Vaccins internationaux, certificats et conseils avant le départ.', mots: 'vaccin fievre jaune voyage certificat' },
  ];
  const serviceById = (id) => SERVICES.find((s) => s.id === id);

  // Équipe de démonstration (noms fictifs) — remplaçable depuis l'onglet « Équipe »
  const EQUIPE_DEMO = [
    ['Dr Mbuyi Kalala', 'medecin', 'medecine-interne'],
    ['Dr Nsimba Lukusa', 'medecin', 'medecine-interne'],
    ['Dr Mwamba Ilunga', 'medecin', 'gyneco'],
    ['Dr Kabeya Tshibangu', 'medecin', 'gyneco'],
    ['Dr Lutete Makiese', 'medecin', 'pediatrie'],
    ['Dr Mayala Nzuzi', 'medecin', 'pediatrie'],
    ['Dr Kasongo Mulamba', 'medecin', 'chirurgie'],
    ['Dr Bokele Ngoy', 'medecin', 'orthopedie'],
    ['Dr Mpiana Kabongo', 'medecin', 'neurochirurgie'],
    ['Dr Luzolo Diambu', 'medecin', 'urologie'],
    ['Dr Kanku Mbala', 'medecin', 'neuropsy'],
    ['Dr Ndombe Kiese', 'medecin', 'ophtalmo'],
    ['Dr Matondo Vuvu', 'medecin', 'dentisterie'],
    ['Dr Kiala Mfumu', 'medecin', 'dermato'],
    ['Dr Bakambu Ilondo', 'medecin', 'anesthesie'],
    ['Dr Nzita Malanda', 'medecin', 'orl'],
    ['Dr Pambu Lusamba', 'medecin', 'voyage'],
    ['Inf. Masika Bahati', 'infirmier', 'urgences'],
    ['Inf. Kavira Amani', 'infirmier', 'urgences'],
    ['Inf. Mukendi Odia', 'infirmier', 'medecine-interne'],
    ['Inf. Tshilanda Mado', 'infirmier', 'pediatrie'],
    ['Inf. Bolingo Sefu', 'infirmier', 'gyneco'],
    ['Inf. Lokwa Bijou', 'infirmier', 'chirurgie'],
    ['Inf. Mbemba Rose', 'infirmier', 'chirurgie'],
    ['Inf. Kalombo Jean', 'infirmier', 'urgences'],
    ['Tech. Kimpiatu Paul', 'technicien', 'laboratoire'],
    ['Tech. Ngalula Esther', 'technicien', 'imagerie'],
    ['Adm. Mpoyi Grâce', 'administratif', 'accueil'],
    ['Adm. Lembe Patrick', 'administratif', 'accueil'],
  ];
  const AUTRES_SERVICES = { urgences: 'Urgences', laboratoire: 'Laboratoire', imagerie: 'Imagerie', accueil: 'Accueil' };
  const nomService = (id) => (serviceById(id) ? serviceById(id).nom : AUTRES_SERVICES[id] || id);
  const TEINTES = ['#0b6e6e', '#3b82c4', '#8a5cf6', '#e8833a', '#2f855a', '#c2477a', '#b7791f', '#4a5bd4'];

  // ===================================================================
  // Utilitaires
  // ===================================================================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const lundi = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const JOURS_COURTS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  const fmtLong = (s) => parseYmd(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtCourt = (s) => parseYmd(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const fmtHeure = (hhmm) => hhmm.replace(':', 'h');
  const initiales = (nom) => nom.replace(/^(Dr|Inf\.|Tech\.|Adm\.)\s+/, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const teinte = (id) => TEINTES[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % TEINTES.length];
  const normalise = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const telNormalise = (s) => String(s).replace(/\D/g, '').replace(/^0+/, '').slice(-9);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const codeReservation = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let c = '';
    for (let i = 0; i < 5; i++) c += alphabet[Math.floor(Math.random() * alphabet.length)];
    return `CN-${c}`;
  };

  function toast(msg) {
    const t = $('[data-toast]');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  function telecharger(nom, contenu, type) {
    const url = URL.createObjectURL(new Blob([contenu], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ===================================================================
  // Données (localStorage)
  // ===================================================================
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* stockage indisponible : données en mémoire seulement */ }
    },
  };

  const db = {
    employes: store.get('cn_employes', null),
    postes: store.get('cn_postes', {}), // { "empId|yyyy-mm-dd": "M" } — exceptions au planning type
    rdvs: store.get('cn_rdvs', null),
    save() {
      store.set('cn_employes', this.employes);
      store.set('cn_postes', this.postes);
      store.set('cn_rdvs', this.rdvs);
    },
  };

  if (!db.employes) {
    db.employes = EQUIPE_DEMO.map(([nom, role, service], i) => ({ id: `e${i + 1}`, nom, role, service, ordre: i }));
  }

  const employe = (id) => db.employes.find((e) => e.id === id);
  const medecinsDuService = (serviceId) => db.employes.filter((e) => e.role === 'medecin' && e.service === serviceId);

  // Planning type (rotation automatique) — les modifications manuelles sont stockées en exceptions.
  function posteParDefaut(emp, dateStr) {
    const d = parseYmd(dateStr);
    const dow = d.getDay();
    const jourAbs = Math.floor(d.getTime() / 86400000);
    const semaine = Math.floor((jourAbs + 3) / 7);
    const k = emp.ordre ?? 0;
    if (emp.role === 'medecin') {
      if (dow === 0) return 'R';
      const semaineDeGarde = (k + semaine) % 4 === 0;
      if (dow === 6) return semaineDeGarde ? 'G' : 'R';
      if (semaineDeGarde && dow >= 4) return 'R'; // récupération avant la garde du samedi
      return (k + semaine + dow) % 3 === 0 ? 'A' : 'J';
    }
    if (emp.role === 'infirmier') {
      const cycle = ['M', 'M', 'A', 'A', 'N', 'N', 'R', 'R'];
      return cycle[(jourAbs + k * 3) % cycle.length];
    }
    if (dow === 0) return 'R';
    if (dow === 6) return k % 2 === semaine % 2 ? 'M' : 'R';
    return 'J';
  }

  function posteDe(empId, dateStr) {
    const surcharge = db.postes[`${empId}|${dateStr}`];
    if (surcharge) return surcharge;
    const emp = employe(empId);
    return emp ? posteParDefaut(emp, dateStr) : 'R';
  }

  function definirPoste(empId, dateStr, code) {
    const key = `${empId}|${dateStr}`;
    const emp = employe(empId);
    if (code === null || (emp && posteParDefaut(emp, dateStr) === code)) delete db.postes[key];
    else db.postes[key] = code;
    db.save();
  }

  const rdvActifs = () => db.rdvs.filter((r) => r.statut !== 'annule');

  function creneauxLibres(medId, dateStr) {
    const plage = PLAGES_CONSULT[posteDe(medId, dateStr)];
    if (!plage) return [];
    const pris = new Set(rdvActifs().filter((r) => r.medecinId === medId && r.date === dateStr).map((r) => r.heure));
    const maintenant = new Date();
    const estAujourdhui = dateStr === ymd(maintenant);
    const limite = maintenant.getHours() * 60 + maintenant.getMinutes() + 30; // au moins 30 min d'avance
    const res = [];
    for (let m = toMin(plage[0]); m + CONFIG.dureeConsultation <= toMin(plage[1]); m += CONFIG.dureeConsultation) {
      if (estAujourdhui && m < limite) continue;
      const h = fromMin(m);
      if (!pris.has(h)) res.push(h);
    }
    return res;
  }

  // Créneaux d'un service sur une date : [{heure, medecinId}] (premier médecin libre par heure)
  function creneauxService(serviceId, medId, dateStr) {
    const meds = medId && medId !== 'any' ? [employe(medId)].filter(Boolean) : medecinsDuService(serviceId);
    const parHeure = new Map();
    for (const m of meds) {
      for (const h of creneauxLibres(m.id, dateStr)) if (!parHeure.has(h)) parHeure.set(h, m.id);
    }
    return [...parHeure.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([heure, medecinId]) => ({ heure, medecinId }));
  }

  function prochainCreneau(serviceId, medId) {
    for (let i = 0; i < CONFIG.joursReservables; i++) {
      const d = ymd(addDays(today(), i));
      const c = creneauxService(serviceId, medId, d);
      if (c.length) return { date: d, ...c[0] };
    }
    return null;
  }

  // Quelques rendez-vous de démonstration pour l'espace personnel
  if (!db.rdvs) {
    db.rdvs = [];
    const patients = [
      ['Kabila', 'Aline'], ['Mutombo', 'Joseph'], ['Lumbala', 'Sarah'], ['Kanza', 'Didier'], ['Nkulu', 'Ruth'],
      ['Mabiala', 'Cédric'], ['Tshala', 'Nadine'], ['Kiswendo', 'Eric'], ['Bitota', 'Grâce'], ['Ilunga', 'Patrick'],
    ];
    let p = 0;
    for (let j = 0; j < 3; j++) {
      const date = ymd(addDays(today(), j));
      for (const s of ['medecine-interne', 'pediatrie', 'gyneco', 'ophtalmo']) {
        const c = creneauxService(s, 'any', date);
        if (!c.length) continue;
        const choix = c[Math.min(c.length - 1, 2 + (p % 4))];
        const [nom, prenom] = patients[p % patients.length];
        db.rdvs.push({
          id: uid(), code: codeReservation(), serviceId: s, medecinId: choix.medecinId, date, heure: choix.heure,
          patient: { nom, prenom, tel: `+24381${pad(p)}123${pad(p + 10)}`, email: '', naissance: '', motif: 'Consultation de contrôle', premiere: p % 3 === 0 },
          statut: 'confirme', creeLe: new Date().toISOString(), demo: true,
        });
        p++;
      }
    }
  }
  db.save();

  // ===================================================================
  // Navigation (routes par hash)
  // ===================================================================
  const ROUTES = { '': 'accueil', rdv: 'rdv', 'mon-rdv': 'mon-rdv', personnel: 'personnel' };

  function route() {
    const [chemin, query] = location.hash.replace(/^#\/?/, '').split('?');
    const vue = ROUTES[chemin] || 'accueil';
    $$('.view').forEach((v) => { v.hidden = v.dataset.view !== vue; });
    $$('.nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#/${chemin}` && chemin !== ''));
    fermerMenu();
    fermerPopover();
    const params = new URLSearchParams(query || '');
    if (vue === 'accueil') renderAccueil();
    if (vue === 'rdv') demarrerReservation(params);
    if (vue === 'mon-rdv') renderMonRdv(params);
    if (vue === 'personnel') renderPersonnel();
    if (!route.cible) window.scrollTo(0, 0);
    if (route.cible) {
      const cible = document.getElementById(route.cible);
      route.cible = null;
      if (cible) requestAnimationFrame(() => cible.scrollIntoView({ behavior: 'smooth' }));
    }
  }

  document.addEventListener('click', (e) => {
    const goto = e.target.closest('[data-goto]');
    if (goto) {
      e.preventDefault();
      route.cible = goto.dataset.goto;
      if (location.hash === '#/' || location.hash === '') route();
      else location.hash = '#/';
    }
  });

  const nav = $('[data-nav]');
  const burger = $('[data-burger]');
  function fermerMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(ouvert));
  });

  // ===================================================================
  // Accueil
  // ===================================================================
  function renderAccueil() {
    renderServices($('[data-service-search]').value);

    $('[data-hours]').innerHTML =
      CONFIG.horaires.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');

    const prochains = ['medecine-interne', 'pediatrie', 'gyneco', 'dentisterie']
      .map((s) => ({ s, c: prochainCreneau(s, 'any') }))
      .filter((x) => x.c);
    $('[data-next-slots]').innerHTML = prochains.length
      ? prochains.map(({ s, c }) => {
          const quand = c.date === ymd(today()) ? 'Aujourd\'hui' : c.date === ymd(addDays(today(), 1)) ? 'Demain' : fmtCourt(c.date);
          return `<li><a href="#/rdv?service=${s}&medecin=${c.medecinId}&date=${c.date}&heure=${c.heure}">
            <span><span class="ns-svc">${esc(serviceById(s).nom)}</span><br /><span class="ns-doc">${esc(employe(c.medecinId).nom)}</span></span>
            <span class="ns-time">${quand}<br />${fmtHeure(c.heure)}</span></a></li>`;
        }).join('')
      : '<li class="muted">Aucun créneau dans les prochains jours — appelez-nous.</li>';
  }

  function renderServices(filtre = '') {
    const q = normalise(filtre.trim());
    const liste = SERVICES.filter((s) => !q || normalise(`${s.nom} ${s.desc} ${s.mots}`).includes(q));
    $('[data-services-grid]').innerHTML = liste.length
      ? liste.map((s) => `
        <a class="svc-card" href="#/rdv?service=${s.id}" style="text-decoration:none;color:inherit">
          <span class="svc-ico">${icon(s.icon)}</span>
          <strong>${esc(s.nom)}</strong>
          <small>${esc(s.desc)}</small>
          <span class="svc-go">Prendre rendez-vous →</span>
        </a>`).join('')
      : '<p class="empty">Aucune spécialité ne correspond. Essayez un autre mot ou appelez-nous.</p>';
  }
  $('[data-service-search]').addEventListener('input', (e) => renderServices(e.target.value));

  // ===================================================================
  // Prise de rendez-vous
  // ===================================================================
  let bk = null;

  function demarrerReservation(params) {
    bk = { step: 1, serviceId: null, medecinId: null, date: null, heure: null, medecinAttribue: null };
    const s = params.get('service');
    if (s && serviceById(s)) {
      bk.serviceId = s;
      bk.step = 2;
      const m = params.get('medecin');
      if (m && (m === 'any' || employe(m))) {
        bk.medecinId = m;
        bk.step = 3;
        const d = params.get('date');
        const h = params.get('heure');
        if (d && h) {
          const dispo = creneauxService(s, m, d).find((c) => c.heure === h);
          if (dispo) { bk.date = d; bk.heure = h; bk.medecinAttribue = dispo.medecinId; bk.step = 4; }
          else bk.date = d;
        }
      }
    }
    renderReservation();
  }

  function allerEtape(n) {
    bk.step = n;
    renderReservation();
    $('.booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderReservation() {
    $$('[data-step-ind]').forEach((li) => {
      const n = Number(li.dataset.stepInd);
      li.classList.toggle('done', n < bk.step);
      li.classList.toggle('current', n === bk.step);
    });
    $('[data-stepper]').hidden = bk.step === 5;

    // Récapitulatif cliquable (permet de revenir à une étape)
    const chips = [];
    if (bk.serviceId && bk.step > 1) chips.push(`<button class="chip" data-back="1">${icon(serviceById(bk.serviceId).icon, 14)}${esc(serviceById(bk.serviceId).nom)}</button>`);
    if (bk.medecinId && bk.step > 2) chips.push(`<button class="chip" data-back="2">${bk.medecinId === 'any' ? 'Premier disponible' : esc(employe(bk.medecinId).nom)}</button>`);
    if (bk.heure && bk.step > 3) chips.push(`<button class="chip" data-back="3">${esc(fmtLong(bk.date))} · ${fmtHeure(bk.heure)}</button>`);
    $('[data-summary]').innerHTML = bk.step < 5 ? chips.join('') : '';

    const body = $('[data-booking-body]');
    if (bk.step === 1) body.innerHTML = etapeService();
    if (bk.step === 2) body.innerHTML = etapeMedecin();
    if (bk.step === 3) body.innerHTML = etapeCreneau();
    if (bk.step === 4) { body.innerHTML = etapeInfos(); restaurerBrouillon(); }
    if (bk.step === 5) body.innerHTML = etapeConfirmation();
  }

  function etapeService() {
    return `
      <h2 class="step-title">Quelle spécialité ?</h2>
      <div class="search-box" style="margin:0 0 14px;max-width:none">
        <input type="search" placeholder="Rechercher (ex. enfant, yeux, grossesse…)" data-bk-search aria-label="Rechercher une spécialité" />
      </div>
      <div class="opt-grid" data-bk-services>${listeServicesOpt('')}</div>
      <p class="notice notice-danger" style="margin-top:18px"><strong>Urgence ?</strong> Ne réservez pas : rendez-vous directement aux urgences ou appelez le +243 810 044 920.</p>`;
  }

  function listeServicesOpt(filtre) {
    const q = normalise(filtre.trim());
    const liste = SERVICES.filter((s) => !q || normalise(`${s.nom} ${s.desc} ${s.mots}`).includes(q));
    if (!liste.length) return '<p class="empty">Aucun résultat.</p>';
    return liste.map((s) => `
      <button class="opt ${bk.serviceId === s.id ? 'selected' : ''}" data-pick-service="${s.id}">
        <span class="svc-ico">${icon(s.icon, 20)}</span>
        <span><strong>${esc(s.nom)}</strong></span>
      </button>`).join('');
  }

  function etapeMedecin() {
    const meds = medecinsDuService(bk.serviceId);
    const tous = prochainCreneau(bk.serviceId, 'any');
    const ligneProchain = (c) => c
      ? `<span class="doc-next">Dès ${c.date === ymd(today()) ? 'aujourd\'hui' : fmtLong(c.date)} à ${fmtHeure(c.heure)}</span>`
      : '<span class="doc-next none">Aucune disponibilité sous 3 semaines</span>';
    return `
      <h2 class="step-title">Avec quel médecin ?</h2>
      <div class="opt-grid">
        <button class="opt ${bk.medecinId === 'any' ? 'selected' : ''}" data-pick-med="any">
          <span class="avatar avatar-any">${icon('check', 20)}</span>
          <span><strong>Le premier disponible</strong><small>Le plus rapide</small>${ligneProchain(tous)}</span>
        </button>
        ${meds.map((m) => `
          <button class="opt ${bk.medecinId === m.id ? 'selected' : ''}" data-pick-med="${m.id}">
            <span class="avatar" style="background:${teinte(m.id)}">${esc(initiales(m.nom))}</span>
            <span><strong>${esc(m.nom)}</strong><small>${esc(serviceById(bk.serviceId).nom)}</small>${ligneProchain(prochainCreneau(bk.serviceId, m.id))}</span>
          </button>`).join('')}
      </div>
      <div class="actions"><button class="btn btn-ghost" data-back="1">← Retour</button></div>`;
  }

  function etapeCreneau() {
    const jours = [];
    for (let i = 0; i < CONFIG.joursReservables; i++) {
      const d = ymd(addDays(today(), i));
      jours.push({ d, n: creneauxService(bk.serviceId, bk.medecinId, d).length });
    }
    if (!bk.date || !jours.find((j) => j.d === bk.date && j.n)) {
      const premier = jours.find((j) => j.n);
      bk.date = premier ? premier.d : null;
    }
    if (!bk.date) {
      return `<h2 class="step-title">Choisissez une date</h2>
        <p class="notice notice-warn">Aucun créneau disponible dans les ${CONFIG.joursReservables} prochains jours pour ce choix.
        Essayez « Le premier disponible » ou appelez le +243 810 044 920.</p>
        <div class="actions"><button class="btn btn-ghost" data-back="2">← Changer de médecin</button></div>`;
    }
    const creneaux = creneauxService(bk.serviceId, bk.medecinId, bk.date);
    const matin = creneaux.filter((c) => toMin(c.heure) < 12 * 60);
    const aprem = creneaux.filter((c) => toMin(c.heure) >= 12 * 60);
    const grille = (titre, liste) => liste.length ? `
      <div class="slot-group"><h4>${titre}</h4><div class="slots">
        ${liste.map((c) => `<button class="slot ${bk.heure === c.heure ? 'selected' : ''}" data-pick-slot="${c.heure}" data-med="${c.medecinId}">${fmtHeure(c.heure)}</button>`).join('')}
      </div></div>` : '';
    return `
      <h2 class="step-title">Choisissez une date et une heure</h2>
      <div class="days" role="listbox" aria-label="Dates">
        ${jours.map(({ d, n }) => {
          const dt = parseYmd(d);
          return `<button class="day ${d === bk.date ? 'selected' : ''}" ${n ? '' : 'disabled'} data-pick-day="${d}" aria-label="${esc(fmtLong(d))}, ${n} créneaux">
            <small>${d === ymd(today()) ? 'auj.' : JOURS_COURTS[dt.getDay()]}</small><strong>${dt.getDate()}</strong>
            <small>${dt.toLocaleDateString('fr-FR', { month: 'short' })}</small><em>${n ? `${n} dispo` : 'complet'}</em></button>`;
        }).join('')}
      </div>
      <p style="margin:16px 0 0;font-weight:700;text-transform:capitalize">${esc(fmtLong(bk.date))}</p>
      ${grille('Matin', matin)}${grille('Après-midi', aprem)}
      <div class="actions"><button class="btn btn-ghost" data-back="2">← Retour</button></div>`;
  }

  function etapeInfos() {
    const med = employe(bk.medecinAttribue);
    return `
      <h2 class="step-title">Vos coordonnées</h2>
      <p class="notice notice-info">Rendez-vous ${esc(fmtLong(bk.date))} à <strong>${fmtHeure(bk.heure)}</strong> avec <strong>${esc(med.nom)}</strong> — ${esc(serviceById(bk.serviceId).nom)}.</p>
      <form class="form" data-infos-form novalidate>
        <div class="field">
          <span>Ce rendez-vous est pour</span>
          <div class="radio-pills">
            <label><input type="radio" name="pour" value="moi" checked /><span>Moi-même</span></label>
            <label><input type="radio" name="pour" value="proche" /><span>Un proche / mon enfant</span></label>
          </div>
        </div>
        <div class="field-row">
          <label class="field"><span>Nom du patient *</span><input name="nom" required autocomplete="family-name" /></label>
          <label class="field"><span>Prénom du patient *</span><input name="prenom" required autocomplete="given-name" /></label>
        </div>
        <div class="field-row">
          <label class="field"><span>Téléphone *</span><input name="tel" type="tel" required autocomplete="tel" placeholder="+243 8xx xxx xxx" />
            <span class="hint">Pour la confirmation et le rappel de votre rendez-vous.</span></label>
          <label class="field"><span>E-mail (facultatif)</span><input name="email" type="email" autocomplete="email" /></label>
        </div>
        <div class="field-row">
          <label class="field"><span>Date de naissance</span><input name="naissance" type="date" max="${ymd(today())}" /></label>
          <div class="field"><span>Première visite à la clinique ?</span>
            <div class="radio-pills">
              <label><input type="radio" name="premiere" value="oui" /><span>Oui</span></label>
              <label><input type="radio" name="premiere" value="non" checked /><span>Non, déjà suivi·e</span></label>
            </div>
          </div>
        </div>
        <label class="field"><span>Motif de la consultation</span>
          <textarea name="motif" rows="3" placeholder="Décrivez brièvement vos symptômes ou la raison de la visite"></textarea></label>
        <label class="check"><input type="checkbox" name="consent" required />
          <span>J'accepte que la clinique utilise ces informations pour gérer mon rendez-vous et me contacter.</span></label>
        <div class="actions">
          <button type="button" class="btn btn-ghost" data-back="3">← Retour</button>
          <button type="submit" class="btn btn-primary btn-lg">Confirmer le rendez-vous</button>
        </div>
      </form>`;
  }

  function restaurerBrouillon() {
    const brouillon = store.get('cn_brouillon_patient', null);
    const form = $('[data-infos-form]');
    if (!brouillon || !form) return;
    for (const k of ['nom', 'prenom', 'tel', 'email']) if (brouillon[k]) form.elements[k].value = brouillon[k];
  }

  function etapeConfirmation() {
    const r = bk.rdv;
    const med = employe(r.medecinId);
    return `
      <div class="confirm">
        <div class="confirm-ico">${icon('check', 36)}</div>
        <h2>Rendez-vous confirmé !</h2>
        <p class="muted">Conservez votre code : il vous sera demandé à l'accueil.</p>
        <div class="code-box">${esc(r.code)}</div>
        <dl class="recap">
          <div><dt>Patient</dt><dd>${esc(r.patient.prenom)} ${esc(r.patient.nom)}</dd></div>
          <div><dt>Date</dt><dd style="text-transform:capitalize">${esc(fmtLong(r.date))}</dd></div>
          <div><dt>Heure</dt><dd>${fmtHeure(r.heure)} <span class="muted" style="font-weight:500">(arrivez 15 min avant)</span></dd></div>
          <div><dt>Spécialité</dt><dd>${esc(serviceById(r.serviceId).nom)}</dd></div>
          <div><dt>Médecin</dt><dd>${esc(med ? med.nom : '—')}</dd></div>
          <div><dt>Lieu</dt><dd>Clinique Ngaliema, av. Papa Ileo, Gombe</dd></div>
        </dl>
        <div class="confirm-actions">
          <button class="btn btn-primary" data-ics="${r.id}">Ajouter à mon agenda</button>
          <button class="btn btn-ghost" onclick="window.print()">Imprimer</button>
          <a class="btn btn-ghost" href="#/">Retour à l'accueil</a>
        </div>
        <p class="muted" style="margin-top:18px;font-size:.9rem">Besoin d'annuler ? Rendez-vous dans <a href="#/mon-rdv?code=${encodeURIComponent(r.code)}">Mon rendez-vous</a>.</p>
      </div>`;
  }

  // Interactions de la réservation (délégation d'événements)
  $('[data-view="rdv"]').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.back) { allerEtape(Number(t.dataset.back)); return; }
    if (t.dataset.pickService) {
      if (bk.serviceId !== t.dataset.pickService) Object.assign(bk, { medecinId: null, date: null, heure: null });
      bk.serviceId = t.dataset.pickService;
      allerEtape(2);
    } else if (t.dataset.pickMed) {
      if (bk.medecinId !== t.dataset.pickMed) Object.assign(bk, { heure: null });
      bk.medecinId = t.dataset.pickMed;
      allerEtape(3);
    } else if (t.dataset.pickDay) {
      bk.date = t.dataset.pickDay;
      bk.heure = null;
      renderReservation();
    } else if (t.dataset.pickSlot) {
      bk.heure = t.dataset.pickSlot;
      bk.medecinAttribue = t.dataset.med;
      allerEtape(4);
    } else if (t.dataset.ics) {
      exporterIcs(db.rdvs.find((r) => r.id === t.dataset.ics));
    }
  });

  $('[data-view="rdv"]').addEventListener('input', (e) => {
    if (e.target.matches('[data-bk-search]')) $('[data-bk-services]').innerHTML = listeServicesOpt(e.target.value);
  });

  $('[data-view="rdv"]').addEventListener('submit', (e) => {
    if (!e.target.matches('[data-infos-form]')) return;
    e.preventDefault();
    const f = e.target;
    let valide = true;
    for (const name of ['nom', 'prenom', 'tel']) {
      const champ = f.elements[name];
      const ok = name === 'tel' ? telNormalise(champ.value).length >= 9 : champ.value.trim().length > 0;
      champ.closest('.field').classList.toggle('invalid', !ok);
      if (!ok) valide = false;
    }
    if (!valide) { toast('Merci de compléter les champs obligatoires (téléphone à 9 chiffres minimum).'); return; }
    if (!f.elements.consent.checked) { toast('Merci d\'accepter l\'utilisation de vos informations.'); return; }

    // Revérifie la disponibilité (le créneau a pu être pris entre-temps)
    const encoreLibre = creneauxLibres(bk.medecinAttribue, bk.date).includes(bk.heure);
    if (!encoreLibre) {
      toast('Ce créneau vient d\'être réservé. Choisissez-en un autre.');
      bk.heure = null;
      allerEtape(3);
      return;
    }

    const patient = {
      nom: f.elements.nom.value.trim(),
      prenom: f.elements.prenom.value.trim(),
      tel: f.elements.tel.value.trim(),
      email: f.elements.email.value.trim(),
      naissance: f.elements.naissance.value,
      motif: f.elements.motif.value.trim(),
      premiere: f.elements.premiere.value === 'oui',
      pourProche: f.elements.pour.value === 'proche',
    };
    const rdv = {
      id: uid(), code: codeReservation(), serviceId: bk.serviceId, medecinId: bk.medecinAttribue,
      date: bk.date, heure: bk.heure, patient, statut: 'confirme', creeLe: new Date().toISOString(),
    };
    db.rdvs.push(rdv);
    db.save();
    store.set('cn_brouillon_patient', { nom: patient.nom, prenom: patient.prenom, tel: patient.tel, email: patient.email });
    bk.rdv = rdv;
    allerEtape(5);
  });

  function exporterIcs(r) {
    if (!r) return;
    const debut = `${r.date.replace(/-/g, '')}T${r.heure.replace(':', '')}00`;
    const fin = `${r.date.replace(/-/g, '')}T${fromMin(toMin(r.heure) + CONFIG.dureeConsultation).replace(':', '')}00`;
    const med = employe(r.medecinId);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Clinique Ngaliema//RDV//FR', 'BEGIN:VEVENT',
      `UID:${r.id}@cliniquengaliema.org`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=Africa/Kinshasa:${debut}`, `DTEND;TZID=Africa/Kinshasa:${fin}`,
      `SUMMARY:RDV ${serviceById(r.serviceId).nom} — Clinique Ngaliema`,
      `DESCRIPTION:Code ${r.code}\\nMédecin : ${med ? med.nom : ''}\\nArrivez 15 minutes avant.`,
      'LOCATION:Clinique Ngaliema\\, avenue Papa Ileo\\, Gombe\\, Kinshasa',
      'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Rendez-vous à la Clinique Ngaliema', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    telecharger(`rdv-${r.code}.ics`, ics, 'text/calendar');
  }

  // ===================================================================
  // Mon rendez-vous (patient)
  // ===================================================================
  function renderMonRdv(params) {
    const form = $('[data-lookup-form]');
    if (params.get('code')) form.elements.code.value = params.get('code');
    $('[data-lookup-result]').innerHTML = '';
  }

  $('[data-lookup-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = e.target.elements.code.value.trim().toUpperCase();
    const tel = telNormalise(e.target.elements.tel.value);
    const r = db.rdvs.find((x) => x.code === code && telNormalise(x.patient.tel) === tel);
    const out = $('[data-lookup-result]');
    if (!r) {
      out.innerHTML = '<p class="notice notice-warn">Aucun rendez-vous trouvé avec ce code et ce numéro. Vérifiez vos informations.</p>';
      return;
    }
    const med = employe(r.medecinId);
    const passe = parseYmd(r.date) < today();
    out.innerHTML = `
      <dl class="recap" style="margin-top:20px">
        <div><dt>Statut</dt><dd class="st-${r.statut}">${STATUTS[r.statut]}</dd></div>
        <div><dt>Patient</dt><dd>${esc(r.patient.prenom)} ${esc(r.patient.nom)}</dd></div>
        <div><dt>Date</dt><dd style="text-transform:capitalize">${esc(fmtLong(r.date))} · ${fmtHeure(r.heure)}</dd></div>
        <div><dt>Spécialité</dt><dd>${esc(serviceById(r.serviceId).nom)}</dd></div>
        <div><dt>Médecin</dt><dd>${esc(med ? med.nom : '—')}</dd></div>
      </dl>
      ${r.statut === 'confirme' && !passe ? `
        <div class="confirm-actions" style="justify-content:flex-start">
          <button class="btn btn-ghost" data-ics-lookup="${r.id}">Ajouter à mon agenda</button>
          <a class="btn btn-ghost" href="#/rdv?service=${r.serviceId}&medecin=${r.medecinId}">Reprendre un autre créneau</a>
          <button class="btn btn-danger" data-annuler="${r.id}">Annuler ce rendez-vous</button>
        </div>` : ''}`;
  });

  $('[data-lookup-result]').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.icsLookup) exporterIcs(db.rdvs.find((r) => r.id === t.dataset.icsLookup));
    if (t.dataset.annuler) {
      if (!confirm('Confirmer l\'annulation de ce rendez-vous ?')) return;
      const r = db.rdvs.find((x) => x.id === t.dataset.annuler);
      r.statut = 'annule';
      db.save();
      toast('Rendez-vous annulé. Le créneau est libéré pour un autre patient.');
      $('[data-lookup-form]').requestSubmit();
    }
  });

  // ===================================================================
  // Espace personnel
  // ===================================================================
  const staff = {
    onglet: 'planning',
    semaine: lundi(today()),
    filtreService: '',
    filtreRole: '',
    jourRdv: ymd(today()),
    filtreMedRdv: '',
  };
  const estConnecte = () => { try { return sessionStorage.getItem('cn_staff') === '1'; } catch { return staff.connecte === true; } };

  function renderPersonnel() {
    const root = $('[data-staff-root]');
    if (!estConnecte()) {
      root.innerHTML = `
        <div class="panel login">
          <h1>Espace personnel</h1>
          <p class="muted">Planning des équipes et rendez-vous du jour. Accès réservé au personnel de la clinique.</p>
          <form class="form" data-login>
            <label class="field"><span>Code d'accès</span>
              <input name="pin" type="password" inputmode="numeric" autocomplete="current-password" required autofocus /></label>
            <button class="btn btn-primary btn-block" type="submit">Se connecter</button>
          </form>
          <p class="notice notice-info" style="margin-top:16px">Démonstration : code <strong>${esc(CONFIG.pinPersonnel)}</strong>.</p>
        </div>`;
      return;
    }
    root.innerHTML = `
      <div class="staff-top">
        <h1>Espace personnel</h1>
        <div class="tabs" role="tablist">
          ${[['planning', 'Planning'], ['rdv', 'Rendez-vous'], ['equipe', 'Équipe']].map(([k, l]) =>
            `<button role="tab" aria-selected="${staff.onglet === k}" class="${staff.onglet === k ? 'active' : ''}" data-tab="${k}">${l}</button>`).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" data-logout>Se déconnecter</button>
      </div>
      <div data-staff-content></div>`;
    renderOnglet();
  }

  function renderOnglet() {
    const c = $('[data-staff-content]');
    if (!c) return;
    if (staff.onglet === 'planning') c.innerHTML = vuePlanning();
    if (staff.onglet === 'rdv') c.innerHTML = vueRdv();
    if (staff.onglet === 'equipe') c.innerHTML = vueEquipe();
  }

  // ---------- Planning ----------
  function joursSemaine() {
    return Array.from({ length: 7 }, (_, i) => ymd(addDays(staff.semaine, i)));
  }

  function employesFiltres() {
    return db.employes
      .filter((e) => (!staff.filtreService || e.service === staff.filtreService) && (!staff.filtreRole || e.role === staff.filtreRole))
      .sort((a, b) => Object.keys(ROLES).indexOf(a.role) - Object.keys(ROLES).indexOf(b.role) || (a.ordre ?? 0) - (b.ordre ?? 0));
  }

  // Repos insuffisant : nuit ou garde suivie d'un poste travaillé le lendemain
  function alerteRepos(empId, dateStr) {
    const veille = posteDe(empId, ymd(addDays(parseYmd(dateStr), -1)));
    const jour = posteDe(empId, dateStr);
    return (veille === 'N' || veille === 'G') && ['M', 'J', 'G'].includes(jour);
  }

  function vuePlanning() {
    const jours = joursSemaine();
    const auj = ymd(today());
    const emps = employesFiltres();
    const servicesOptions = [...new Set(db.employes.map((e) => e.service))]
      .map((s) => `<option value="${s}" ${staff.filtreService === s ? 'selected' : ''}>${esc(nomService(s))}</option>`).join('');

    let alertesRepos = 0;
    let depassements = 0;
    let lignes = '';
    let roleCourant = null;
    for (const e of emps) {
      if (e.role !== roleCourant) {
        roleCourant = e.role;
        lignes += `<tr class="group-row"><th colspan="9">${ROLES[e.role].label}s</th></tr>`;
      }
      let heures = 0;
      const cellules = jours.map((d) => {
        const p = posteDe(e.id, d);
        heures += POSTES[p].heures;
        const alerte = alerteRepos(e.id, d);
        if (alerte) alertesRepos++;
        const surcharge = Boolean(db.postes[`${e.id}|${d}`]);
        return `<td class="${d === auj ? 'today' : ''}"><button class="shift p-${p} ${surcharge ? 'overridden' : ''} ${alerte ? 'alert' : ''}"
          data-shift="${e.id}|${d}" title="${esc(POSTES[p].label)}${alerte ? ' — repos insuffisant après une nuit/garde' : ''}${surcharge ? ' (modifié)' : ''}">
          ${POSTES[p].label}<small>${POSTES[p].h || '&nbsp;'}</small></button></td>`;
      }).join('');
      const depasse = heures > CONFIG.heuresMaxSemaine;
      if (depasse) depassements++;
      lignes += `<tr>
        <th class="emp"><span class="emp-name"><span class="role-dot" style="background:${ROLES[e.role].couleur}"></span>${esc(e.nom)}</span>
          <span class="emp-meta">${esc(nomService(e.service))}</span></th>
        ${cellules}
        <td class="hours-cell ${depasse ? 'over' : ''}" title="${depasse ? `Au-delà de ${CONFIG.heuresMaxSemaine} h` : ''}">${heures} h</td></tr>`;
    }

    // Couverture : personnel de nuit (infirmiers en N + médecins en G) et médecins en consultation
    const couverture = jours.map((d) => {
      const nuit = db.employes.filter((e) => ['N', 'G'].includes(posteDe(e.id, d)) && ['infirmier', 'medecin'].includes(e.role)).length;
      const consult = db.employes.filter((e) => e.role === 'medecin' && PLAGES_CONSULT[posteDe(e.id, d)]).length;
      return { nuit, consult };
    });
    const joursSansNuit = couverture.filter((c) => c.nuit < 2).length;

    const fin = addDays(staff.semaine, 6);
    return `
      <div class="stats">
        <div class="stat"><small>Personnel affiché</small><strong>${emps.length}</strong></div>
        <div class="stat"><small>Postes modifiés cette semaine</small><strong>${jours.reduce((n, d) => n + db.employes.filter((e) => db.postes[`${e.id}|${d}`]).length, 0)}</strong></div>
        <div class="stat ${alertesRepos ? 'warn' : ''}"><small>Alertes repos</small><strong>${alertesRepos}</strong></div>
        <div class="stat ${depassements || joursSansNuit ? 'warn' : ''}"><small>> ${CONFIG.heuresMaxSemaine} h · nuits sous-dotées</small><strong>${depassements} · ${joursSansNuit}</strong></div>
      </div>
      <div class="card">
        <div class="toolbar">
          <button class="icon-btn" data-week="-1" aria-label="Semaine précédente">${icon('gauche', 18)}</button>
          <span class="week-label">${staff.semaine.getDate()} ${staff.semaine.toLocaleDateString('fr-FR', { month: 'short' })} – ${fin.getDate()} ${fin.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
          <button class="icon-btn" data-week="1" aria-label="Semaine suivante">${icon('droite', 18)}</button>
          <button class="btn btn-ghost btn-sm" data-week="0">Cette semaine</button>
          <span class="grow"></span>
          <select data-filter-role aria-label="Filtrer par fonction">
            <option value="">Toutes fonctions</option>
            ${Object.entries(ROLES).map(([k, r]) => `<option value="${k}" ${staff.filtreRole === k ? 'selected' : ''}>${r.label}</option>`).join('')}
          </select>
          <select data-filter-service aria-label="Filtrer par service"><option value="">Tous services</option>${servicesOptions}</select>
          <button class="btn btn-ghost btn-sm" data-export-csv>Exporter CSV</button>
          <button class="btn btn-ghost btn-sm" onclick="window.print()">Imprimer</button>
        </div>
        <div class="legend">
          ${Object.entries(POSTES).map(([k, p]) => `<span class="tag p-${k}">${p.label}${p.h ? ` · ${p.h}` : ''}</span>`).join('')}
          <span class="muted" style="margin-left:auto">Cliquez sur une case pour modifier · ● = modifié manuellement</span>
        </div>
        <div class="table-scroll">
          <table class="planning">
            <thead><tr>
              <th class="emp">Employé</th>
              ${jours.map((d) => { const dt = parseYmd(d); return `<th class="${d === auj ? 'today' : ''}">${JOURS_COURTS[dt.getDay()]}<b>${dt.getDate()}</b></th>`; }).join('')}
              <th>Total</th>
            </tr></thead>
            <tbody>
              ${lignes || '<tr><td colspan="9" class="empty">Aucun employé pour ce filtre.</td></tr>'}
              <tr class="cover-row"><th class="emp">Effectif de nuit (min. 2)</th>
                ${couverture.map((c) => `<td class="${c.nuit < 2 ? 'cover-ko' : 'cover-ok'}">${c.nuit}</td>`).join('')}<td></td></tr>
              <tr class="cover-row"><th class="emp">Médecins en consultation</th>
                ${couverture.map((c) => `<td>${c.consult}</td>`).join('')}<td></td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function exporterPlanningCsv() {
    const jours = joursSemaine();
    const sep = ';';
    const lignes = [['Employé', 'Fonction', 'Service', ...jours.map((d) => fmtCourt(d)), 'Heures'].join(sep)];
    for (const e of employesFiltres()) {
      const postes = jours.map((d) => posteDe(e.id, d));
      const heures = postes.reduce((n, p) => n + POSTES[p].heures, 0);
      lignes.push([e.nom, ROLES[e.role].label, nomService(e.service), ...postes.map((p) => `${POSTES[p].label} ${POSTES[p].h}`.trim()), heures]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(sep));
    }
    telecharger(`planning-${jours[0]}.csv`, `\ufeff${lignes.join('\r\n')}`, 'text/csv;charset=utf-8');
  }

  // Popover de sélection d'un poste
  const popover = $('[data-popover]');
  function ouvrirPopover(bouton) {
    const [empId, date] = bouton.dataset.shift.split('|');
    const emp = employe(empId);
    const actuel = posteDe(empId, date);
    const rdvDuJour = rdvActifs().filter((r) => r.medecinId === empId && r.date === date).length;
    popover.innerHTML = `
      <h5>${esc(emp.nom)} · ${esc(fmtLong(date))}</h5>
      ${Object.entries(POSTES).map(([k, p]) => `
        <button data-set="${k}"><span class="tag p-${k}">${p.label}</span><span class="muted" style="font-size:.78rem">${p.h}${k === actuel ? ' ✓' : ''}</span></button>`).join('')}
      <hr />
      <button data-set="__defaut"><span>Rétablir le planning type</span><span class="tag p-${posteParDefaut(emp, date)}">${POSTES[posteParDefaut(emp, date)].label}</span></button>
      ${emp.role === 'medecin' && rdvDuJour ? `<p class="notice notice-warn" style="margin:6px 4px 2px;font-size:.8rem">${rdvDuJour} RDV patient ce jour-là.</p>` : ''}`;
    popover.dataset.target = bouton.dataset.shift;
    popover.hidden = false;
    const r = bouton.getBoundingClientRect();
    const h = popover.offsetHeight;
    const top = r.bottom + 6 + h > window.innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6;
    popover.style.top = `${top}px`;
    popover.style.left = `${Math.min(Math.max(8, r.left + r.width / 2 - 115), window.innerWidth - 238)}px`;
    popover.querySelector('button').focus();
  }
  function fermerPopover() { popover.hidden = true; }

  popover.addEventListener('click', (e) => {
    const b = e.target.closest('[data-set]');
    if (!b) return;
    const [empId, date] = popover.dataset.target.split('|');
    const code = b.dataset.set === '__defaut' ? null : b.dataset.set;
    const emp = employe(empId);
    if (emp.role === 'medecin' && code && !PLAGES_CONSULT[code]) {
      const rdvDuJour = rdvActifs().filter((r) => r.medecinId === empId && r.date === date && ['confirme', 'arrive'].includes(r.statut));
      if (rdvDuJour.length && !confirm(`${emp.nom} a ${rdvDuJour.length} rendez-vous patient ce jour-là. Ils resteront à réaffecter dans l'onglet Rendez-vous. Continuer ?`)) return;
    }
    definirPoste(empId, date, code);
    fermerPopover();
    renderOnglet();
    toast(`Planning mis à jour : ${emp.nom} — ${POSTES[posteDe(empId, date)].label}`);
  });
  document.addEventListener('click', (e) => {
    if (!popover.hidden && !popover.contains(e.target) && !e.target.closest('[data-shift]')) fermerPopover();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermerPopover(); });
  window.addEventListener('resize', fermerPopover);
  window.addEventListener('scroll', fermerPopover, { passive: true });

  // ---------- Rendez-vous du jour ----------
  function vueRdv() {
    const liste = db.rdvs
      .filter((r) => r.date === staff.jourRdv && (!staff.filtreMedRdv || r.medecinId === staff.filtreMedRdv))
      .sort((a, b) => a.heure.localeCompare(b.heure));
    const compte = (s) => liste.filter((r) => r.statut === s).length;
    const medecins = db.employes.filter((e) => e.role === 'medecin');
    const medsAbsents = new Set(medecins.filter((m) => !PLAGES_CONSULT[posteDe(m.id, staff.jourRdv)]).map((m) => m.id));
    return `
      <div class="stats">
        <div class="stat"><small>Rendez-vous</small><strong>${liste.filter((r) => r.statut !== 'annule').length}</strong></div>
        <div class="stat"><small>Arrivés / terminés</small><strong>${compte('arrive')} / ${compte('termine')}</strong></div>
        <div class="stat"><small>Premières visites</small><strong>${liste.filter((r) => r.patient.premiere && r.statut !== 'annule').length}</strong></div>
        <div class="stat ${compte('absent') ? 'warn' : ''}"><small>Absents · annulés</small><strong>${compte('absent')} · ${compte('annule')}</strong></div>
      </div>
      <div class="card">
        <div class="toolbar">
          <button class="icon-btn" data-day="-1" aria-label="Jour précédent">${icon('gauche', 18)}</button>
          <input type="date" value="${staff.jourRdv}" data-day-input aria-label="Date" />
          <button class="icon-btn" data-day="1" aria-label="Jour suivant">${icon('droite', 18)}</button>
          <button class="btn btn-ghost btn-sm" data-day="0">Aujourd'hui</button>
          <span class="grow"></span>
          <select data-filter-med aria-label="Filtrer par médecin">
            <option value="">Tous les médecins</option>
            ${medecins.map((m) => `<option value="${m.id}" ${staff.filtreMedRdv === m.id ? 'selected' : ''}>${esc(m.nom)} — ${esc(nomService(m.service))}</option>`).join('')}
          </select>
          <a class="btn btn-primary btn-sm" href="#/rdv">+ Nouveau RDV</a>
        </div>
        <ul class="rdv-list">
          ${liste.length ? liste.map((r) => {
            const med = employe(r.medecinId);
            const absentPlanning = medsAbsents.has(r.medecinId) && ['confirme', 'arrive'].includes(r.statut);
            return `<li class="rdv-item">
              <span class="rdv-time">${fmtHeure(r.heure)}</span>
              <span class="rdv-who">
                <strong>${esc(r.patient.prenom)} ${esc(r.patient.nom)} ${r.patient.premiere ? '<span class="tag p-J" style="font-size:.7rem">1re visite</span>' : ''}</strong>
                <small>${esc(serviceById(r.serviceId).nom)} · ${esc(med ? med.nom : 'Médecin supprimé')} · ${esc(r.patient.tel)} · ${esc(r.code)}</small>
                ${r.patient.motif ? `<small style="display:block">« ${esc(r.patient.motif)} »</small>` : ''}
                ${absentPlanning ? '<small style="display:block;color:var(--danger);font-weight:700">⚠ Médecin non planifié en consultation ce jour — à réaffecter</small>' : ''}
              </span>
              <select data-statut="${r.id}" class="st-${r.statut}" aria-label="Statut">
                ${Object.entries(STATUTS).map(([k, l]) => `<option value="${k}" ${r.statut === k ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </li>`;
          }).join('') : '<li class="empty">Aucun rendez-vous ce jour.</li>'}
        </ul>
      </div>`;
  }

  // ---------- Équipe ----------
  function vueEquipe() {
    const tri = [...db.employes].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    const optionsService = [...SERVICES.map((s) => [s.id, s.nom]), ...Object.entries(AUTRES_SERVICES)]
      .map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('');
    return `
      <div class="team-grid">
        <div class="card">
          <div class="toolbar"><strong>${db.employes.length} membres du personnel</strong><span class="grow"></span>
            <input type="search" placeholder="Rechercher…" data-team-search aria-label="Rechercher un employé" /></div>
          <ul class="team-list" data-team-list>
            ${tri.map((e) => `
              <li data-nom="${esc(normalise(e.nom))}">
                <span class="avatar" style="background:${ROLES[e.role].couleur};width:38px;height:38px;font-size:.82rem">${esc(initiales(e.nom))}</span>
                <span class="grow"><strong>${esc(e.nom)}</strong><small>${ROLES[e.role].label} · ${esc(nomService(e.service))}</small></span>
                <button class="btn btn-danger btn-sm" data-suppr="${e.id}">Retirer</button>
              </li>`).join('')}
          </ul>
        </div>
        <div class="card card-pad">
          <h3>Ajouter un membre</h3>
          <form class="form" data-add-emp>
            <label class="field"><span>Nom complet</span><input name="nom" required placeholder="Dr Prénom Nom" /></label>
            <label class="field"><span>Fonction</span>
              <select name="role">${Object.entries(ROLES).map(([k, r]) => `<option value="${k}">${r.label}</option>`).join('')}</select></label>
            <label class="field"><span>Service</span><select name="service">${optionsService}</select></label>
            <button class="btn btn-primary" type="submit">Ajouter</button>
            <p class="muted" style="font-size:.85rem;margin:0">Un planning type est appliqué automatiquement ; ajustez-le ensuite dans l'onglet Planning. Les médecins ajoutés deviennent réservables en ligne.</p>
          </form>
          <hr style="border:0;border-top:1px solid var(--line);margin:20px 0" />
          <h3>Données</h3>
          <p class="muted" style="font-size:.85rem">Données enregistrées dans ce navigateur (version de démonstration).</p>
          <button class="btn btn-danger btn-sm" data-reset>Réinitialiser les données de démonstration</button>
        </div>
      </div>`;
  }

  // ---------- Événements de l'espace personnel ----------
  const staffRoot = $('[data-staff-root]');

  staffRoot.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.matches('[data-login]')) {
      if (e.target.elements.pin.value === CONFIG.pinPersonnel) {
        try { sessionStorage.setItem('cn_staff', '1'); } catch { staff.connecte = true; }
        renderPersonnel();
      } else {
        toast('Code incorrect.');
        e.target.elements.pin.select();
      }
    }
    if (e.target.matches('[data-add-emp]')) {
      const f = e.target.elements;
      const ordre = Math.max(0, ...db.employes.map((x) => x.ordre ?? 0)) + 1;
      db.employes.push({ id: `e${uid()}`, nom: f.nom.value.trim(), role: f.role.value, service: f.service.value, ordre });
      db.save();
      toast(`${f.nom.value.trim()} ajouté·e à l'équipe.`);
      renderOnglet();
    }
  });

  staffRoot.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.tab) { staff.onglet = t.dataset.tab; renderPersonnel(); return; }
    if ('logout' in t.dataset) {
      try { sessionStorage.removeItem('cn_staff'); } catch { staff.connecte = false; }
      renderPersonnel();
      return;
    }
    if (t.dataset.shift) { e.stopPropagation(); ouvrirPopover(t); return; }
    if (t.dataset.week !== undefined) {
      const n = Number(t.dataset.week);
      staff.semaine = n === 0 ? lundi(today()) : addDays(staff.semaine, 7 * n);
      renderOnglet();
    }
    if (t.dataset.day !== undefined) {
      const n = Number(t.dataset.day);
      staff.jourRdv = n === 0 ? ymd(today()) : ymd(addDays(parseYmd(staff.jourRdv), n));
      renderOnglet();
    }
    if ('exportCsv' in t.dataset) exporterPlanningCsv();
    if (t.dataset.suppr) {
      const emp = employe(t.dataset.suppr);
      const futurs = rdvActifs().filter((r) => r.medecinId === emp.id && parseYmd(r.date) >= today() && r.statut === 'confirme').length;
      if (!confirm(`Retirer ${emp.nom} de l'équipe ?${futurs ? `\n${futurs} rendez-vous à venir lui sont attribués.` : ''}`)) return;
      db.employes = db.employes.filter((x) => x.id !== emp.id);
      for (const k of Object.keys(db.postes)) if (k.startsWith(`${emp.id}|`)) delete db.postes[k];
      db.save();
      renderOnglet();
    }
    if ('reset' in t.dataset) {
      if (!confirm('Effacer toutes les modifications (planning, rendez-vous, équipe) ?')) return;
      for (const k of ['cn_employes', 'cn_postes', 'cn_rdvs', 'cn_brouillon_patient']) {
        try { localStorage.removeItem(k); } catch { /* ignoré */ }
      }
      location.reload();
    }
  });

  staffRoot.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-filter-service]')) { staff.filtreService = t.value; renderOnglet(); }
    if (t.matches('[data-filter-role]')) { staff.filtreRole = t.value; renderOnglet(); }
    if (t.matches('[data-filter-med]')) { staff.filtreMedRdv = t.value; renderOnglet(); }
    if (t.matches('[data-day-input]') && t.value) { staff.jourRdv = t.value; renderOnglet(); }
    if (t.matches('[data-statut]')) {
      const r = db.rdvs.find((x) => x.id === t.dataset.statut);
      r.statut = t.value;
      db.save();
      renderOnglet();
      toast(`${r.patient.prenom} ${r.patient.nom} : ${STATUTS[r.statut]}`);
    }
  });

  staffRoot.addEventListener('input', (e) => {
    if (!e.target.matches('[data-team-search]')) return;
    const q = normalise(e.target.value);
    $$('[data-team-list] li').forEach((li) => { li.hidden = q && !li.dataset.nom.includes(q); });
  });

  // ===================================================================
  // Démarrage
  // ===================================================================
  $('[data-year]').textContent = new Date().getFullYear();
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', () => { location.reload(); }); // synchro entre onglets
  route();
})();
