/* CABINET — service worker (v1.1)
   Permet d'installer Cabinet comme une appli et de l'ouvrir sans réseau.
   · La page : le réseau d'abord (dernière version), la copie gardée si le réseau manque ou tarde (3 s).
   · Icônes et manifeste : la copie gardée d'abord.
   · Aucune donnée ne passe ici : elles restent chiffrées dans le navigateur, jamais envoyées nulle part. */
const CACHE = 'cabinet-v1.1';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/favicon.svg'];
const DELAI_RESEAU = 3000;
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS.map(f => new Request(f, {cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k.startsWith('cabinet-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const copieGardee = r => caches.match(r, {ignoreSearch:true}).then(x => x || caches.match('./index.html'));
self.addEventListener('fetch', e => {
  const r = e.request;
  if(r.method !== 'GET') return;
  const u = new URL(r.url);
  if(u.origin !== self.location.origin) return;
  const page = r.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html');
  if(page){
    const reseau = fetch(r).then(rep => { if(rep.ok){ const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); } return rep; });
    e.waitUntil(reseau.catch(() => {}));
    e.respondWith(new Promise(ok => {
      let fini = false;
      const servir = x => { if(!fini && x){ fini = true; ok(x); } };
      const t = setTimeout(() => copieGardee(r).then(x => { if(x) servir(x); else reseau.then(servir, () => servir(Response.error())); }), DELAI_RESEAU);
      reseau.then(rep => { clearTimeout(t); servir(rep); }, () => { clearTimeout(t); copieGardee(r).then(x => servir(x || Response.error())); });
    }));
    return;
  }
  e.respondWith(caches.match(r).then(x => x || fetch(r)));
});
