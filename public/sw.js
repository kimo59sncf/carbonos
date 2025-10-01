/**
 * Service Worker pour CarbonOS PWA
 * Optimisations performances et fonctionnalités offline
 */

const CACHE_NAME = 'carbonos-v2.0';
const STATIC_CACHE = 'carbonos-static-v2.0';
const DYNAMIC_CACHE = 'carbonos-dynamic-v2.0';

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html',
  // CSS et JS critiques seront ajoutés dynamiquement
];

// Limites de cache
const CACHE_LIMITS = {
  static: 50,
  dynamic: 100,
  images: 200,
};

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');

  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Cache statique');
        return cache.addAll(STATIC_ASSETS);
      }),

      // Pré-cache des routes importantes
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll([
          '/dashboard',
          '/emissions',
          '/reports',
        ]);
      }),

      // Skip waiting pour activation immédiate
      self.skipWaiting(),
    ])
  );
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');

  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches
      cleanupOldCaches(),

      // Prise de contrôle immédiate
      self.clients.claim(),
    ])
  );
});

/**
 * Interception des requêtes réseau
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégie différente selon le type de ressource
  if (isStaticAsset(request)) {
    // Cache First pour les ressources statiques
    event.respondWith(cacheFirstStrategy(request));
  } else if (isImageRequest(request)) {
    // Cache First avec fallback réseau pour les images
    event.respondWith(imageStrategy(request));
  } else if (isAPIRequest(request)) {
    // Network First pour les APIs
    event.respondWith(networkFirstStrategy(request));
  } else if (isNavigationRequest(request)) {
    // Network First avec fallback offline pour la navigation
    event.respondWith(navigationStrategy(request));
  } else {
    // Stale While Revalidate par défaut
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

/**
 * Gestion des notifications push
 */
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push reçu');

  let notificationData = {
    title: 'CarbonOS',
    body: 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'carbonos-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'Voir',
      },
      {
        action: 'dismiss',
        title: 'Ignorer',
      },
    ],
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Erreur lors du parsing des données push:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

/**
 * Gestion des clics sur notifications
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Clic notification');

  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Ouvrir l'application
    event.waitUntil(
      self.clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

/**
 * Synchronisation en arrière-plan
 */
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Sync background');

  if (event.tag === 'emissions-sync') {
    event.waitUntil(syncEmissionsData());
  }
});

/**
 * Gestion des messages depuis l'application principale
 */
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message reçu', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Stratégies de cache
 */

// Cache First - Pour les ressources statiques
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache First Strategy Error:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First - Pour les APIs et navigation
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network First Strategy: Récupération depuis le cache');
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback offline pour la navigation
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }

    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate - Pour le contenu général
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  // Lancer la requête réseau en arrière-plan
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  // Retourner immédiatement le cache si disponible
  return cachedResponse || networkPromise;
}

// Stratégie spécifique aux images
async function imageStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache des images avec limite
      await cacheWithLimit(DYNAMIC_CACHE, request, networkResponse.clone(), CACHE_LIMITS.images);
    }

    return networkResponse;
  } catch (error) {
    console.log('Image Strategy: Utilisation du cache');
    return caches.match(request) || new Response('', { status: 404 });
  }
}

// Stratégie de navigation avec fallback offline
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Navigation Strategy: Mode offline');
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return caches.match('/offline.html');
  }
}

/**
 * Utilitaires
 */

// Nettoyage des anciens caches
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter((name) =>
    name !== STATIC_CACHE && name !== DYNAMIC_CACHE
  );

  return Promise.all(
    oldCaches.map((cacheName) => caches.delete(cacheName))
  );
}

// Cache avec limite de taille
async function cacheWithLimit(cacheName, request, response, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length >= limit) {
    // Supprimer l'élément le plus ancien
    const oldestKey = keys[0];
    await cache.delete(oldestKey);
  }

  cache.put(request, response);
}

// Vérification du type de requête
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/);
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
}

// Synchronisation des données d'émissions
async function syncEmissionsData() {
  try {
    // Récupérer les données en attente de synchronisation depuis IndexedDB
    const pendingData = await getPendingEmissionsData();

    for (const data of pendingData) {
      try {
        await fetch('/api/emissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        // Supprimer des données en attente après succès
        await removePendingEmissionData(data.id);
      } catch (error) {
        console.error('Erreur lors de la sync:', error);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}

// Gestion IndexedDB pour les données hors ligne
async function getPendingEmissionsData() {
  // Implémentation IndexedDB pour stockage hors ligne
  return [];
}

async function removePendingEmissionData(id) {
  // Implémentation IndexedDB pour suppression
}

// Export pour utilisation dans l'application principale
self.addEventListener('beforeunload', () => {
  // Fermeture propre du Service Worker si nécessaire
});