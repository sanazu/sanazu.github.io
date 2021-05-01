// Flag for enabling cache in production
var doCache = true;

var CACHE_NAME = 'pwa-app-cache';

// Delete old caches
self.addEventListener('activate', event => {
  const currentCachelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!currentCachelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  );
});

// This triggers when user starts the app
self.addEventListener('install', function(event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          const urlsToCache = [
                'index.html', '/', '', 'static/js/2.580e3f16.chunk.js.LICENSE.txt','static/js/runtime-main.7a6efe9b.js',
                'logo.png','static/css/main.162f152b.chunk.css','static/js/main.542e1f63.chunk.js','static/js/2.580e3f16.chunk.js','manifest.webmanifest'
              ];
          cache.addAll(urlsToCache);
        })
    );
  }
});

// Here we intercept request and serve up the matching files
self.addEventListener('fetch', function(event) {
  if (doCache) {
    console.log(event.request);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});
