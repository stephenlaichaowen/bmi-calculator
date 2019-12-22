// SW Version
const version = '1.0'

// Static Cache - App Shell
const appAssets = [
  'index.html',  
  'all.css',
  'assets/loop.png',
  'assets/BMICLogo.png',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
  'https://code.jquery.com/jquery-3.4.1.slim.min.js',
  'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js'
]

// SW Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll(appAssets))
  )
})

// SW Activate
self.addEventListener('activate', e => {
  // Clean static cache
  let cleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `static-${version}` && key.match('static-')) {
        return caches.delete(key)
      }
    })
  })
  e.waitUntil(cleaned)
})

// SW Fetch
self.addEventListener('fetch', e => {
  // App shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request))
  }
})

// Static cache strategy - Cache First / Cache with Network Fallback
const staticCache = req => {
  return caches.match(req).then(cacheRes => {
    
    // Return cached response if found
    if(cacheRes) return cacheRes

    // Fall back to network
    return fetch(req).then(networkRes => {

      // Update cache with new response
      caches.open(`static-${version}`)
      .then(cache => cache.put(req, networkRes))

      // Return Clone of Network Response
      return networkRes.clone()
    })

  })
}