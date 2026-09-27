// Офлайн-оболочка: страница открывается без сети, отметки ждут в localStorage до связи.
const CACHE = 'shell-v13';
const SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg?v=2',
  '/apple-touch-icon.png?v=2',
  '/fonts/montserrat-cyrillic-400-normal.woff2',
  '/fonts/montserrat-cyrillic-500-normal.woff2',
  '/fonts/montserrat-cyrillic-600-normal.woff2',
  '/fonts/montserrat-cyrillic-700-normal.woff2',
  '/fonts/montserrat-latin-400-normal.woff2',
  '/fonts/montserrat-latin-500-normal.woff2',
  '/fonts/montserrat-latin-600-normal.woff2',
  '/fonts/montserrat-latin-700-normal.woff2',
  '/fonts/quran/UthmanicHafs1Ver18.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;

  // Страница: сначала сеть (свежий деплой), без сети — последняя сохранённая версия
  if (e.request.mode === 'navigate' || url.pathname === '/') {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put('/', copy));
      return r;
    }).catch(() => caches.match('/')));
    return;
  }

  // Шрифты и иконки: из кэша
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
