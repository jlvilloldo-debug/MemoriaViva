// Memoria Viva · portal de familias: funciona sin señal dentro del parque.
// Solo guarda sus propios archivos; no toca la plataforma de administración ni otros sitios.
'use strict';
const CACHE = 'parque-iraola-familias-v1';
const ARCHIVOS = ['familias.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const propio = (url) => url.origin === self.location.origin && ARCHIVOS.some((a) => url.pathname.endsWith('/' + a));
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || !propio(url)) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
