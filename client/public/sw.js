const CACHE_NAME = 'mgnrega-static-v2';
const API_CACHE_NAME = 'mgnrega-api-v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const urlsToCache = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
      self.skipWaiting()
    ])
  );
});

function isAPIRequest(url) {
  return url.includes('/api/');
}

function shouldCache(url) {
  return url.includes('/api/districts') || 
         url.includes('/performance') || 
         url.includes('/trends') ||
         url.includes('/compare') ||
         url.includes('/alerts');
}

async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    if (!response || response.status !== 200) {
      return response;
    }

    if (shouldCache(request.url)) {
      const cache = await caches.open(API_CACHE_NAME);
      const responseToCache = response.clone();
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cached-at', Date.now().toString());
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

function isCacheValid(response) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return true;
  
  const age = Date.now() - parseInt(cachedAt);
  return age < CACHE_DURATION;
}

function isStaticAsset(url) {
  return url.includes('.js') || 
         url.includes('.css') || 
         url.includes('.woff') || 
         url.includes('.woff2') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  if (isAPIRequest(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse && isCacheValid(cachedResponse)) {
          fetchAndCache(request.clone());
          return cachedResponse;
        }
        
        return fetchAndCache(request);
      })
    );
  } else if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            return cachedResponse || new Response('Offline - Asset not cached', { status: 503 });
          });

          return cachedResponse || fetchPromise;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request).catch(() => {
            return caches.match('/').then((fallback) => {
              return fallback || new Response('Offline', { status: 503 });
            });
          });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
