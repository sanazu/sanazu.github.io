const CACHE_NAME = "version-1";
let offlineMode = false;
const self = this;

(async () => {
//   const { files, offlineMode } = await fetch("asset-manifest.json").then(
//     (data) => data.json()
//   );
//   let urlsToCache = Object.values(files).map((a) => a.substr(1));
  // load SW

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then((reg) => console.log("Success: ", reg.scope))
        .catch((err) => console.log("Failure: ", err));
    });
  }

  // Install SW
  self.addEventListener("install", async (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        console.log("Opened cache");
        const { files, offlineMode, startUrl } = await fetch("asset-manifest.json").then(
            (data) => data.json()
          );
        let urlsToCache = Object.values(files).map((a) => a.substr(1));
        return cache.addAll(urlsToCache);
      })
    );
  });

  // Listen for requests
  self.addEventListener("fetch", (event) => {
    let local = caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    });
    let offline = caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match(event.request));
    });
    event.respondWith(offlineMode ? offline : local);
  });

  // Activate the SW
  self.addEventListener("activate", (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
    );
  });
})();
