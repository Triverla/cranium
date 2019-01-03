const siteCacheName = "cranium";
const cacheName = "cranium-static";
var siteImgsCache = 'cranium-imgs';
const filesToCache = [
    "./", 
"./css/font-awesome.min.css",
 "./css/materialize.css",
 "./css/style.css",
 "./css/bootstrap.css",
 "./css/responsive.css",
 "./js/jquery.min.js",
 "./js/jquery-ui.js",
 "./js/angular.min.js",
 "./js/bootstrap.js",
 "./js/materialize.min.js",
 "./js/jquery.mixitup.min.js",
 "./js/custom.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== cacheName && key !== siteCacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener("fetch", event => {
    const baseURL = new URL(event.request.url);

    if (baseURL.origin === location.origin) {
        if (baseURL.pathname === cacheName) {
          event.respondWith(caches.match(cacheName));
          return;
        } 
      }
    if (baseURL.pathname.startsWith('./images/')) {
        event.respondWith(servePhoto(event.request));
        return;
    }

    if (event.request.url.indexOf(baseURL) > -1) {
        event.respondWith(
            caches.open(siteCacheName).then(cache => {
                return fetch(event.request).then(response => {
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            })
        );
        return;
    }
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

function servePhoto(request) {
    var storageUrl = request.url.replace(/-\d+px\.png$/, '');
  
    return caches.open(siteImgsCache).then(function(cache) {
      return cache.match(storageUrl).then(function(response) {
        if (response) return response;
  
        return fetch(request).then(function(networkResponse) {
          cache.put(storageUrl, networkResponse.clone());
          return networkResponse;
        });
      });
    });
  }

self.addEventListener("message", event => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});

// Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    let refreshing;
    self.addEventListener('controllerchange', () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
