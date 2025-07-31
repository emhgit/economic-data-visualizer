addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  let path = url.pathname;

  // Default to index.html for root path
  if (path === '/') {
    path = '/index.html';
  }

  // Remove leading slash for R2 key
  const key = path.startsWith('/') ? path.slice(1) : path;

  // Use the Cache API
  const cacheKey = new Request(url.toString(), {
      headers: request.headers,
      method: 'GET' // Always use GET for cache key to normalize
  });
  const cache = caches.default;

  // Try to find the response in cache
  let response = await cache.match(cacheKey);

  if (!response) {
    // If not in cache, fetch from R2
    try {
      const object = await ECONOMIC_DATA_VISUALIZER.get(key);

      if (object === null) {
        // If file not found, try serving index.html for SPA routing
        if (path.endsWith('.html') || path.indexOf('.') === -1) {
          const index = await ECONOMIC_DATA_VISUALIZER.get('index.html');
          if (index !== null) {
            response = new Response(index.body, {
              headers: { 
                  'Content-Type': 'text/html',
                  'Cache-Control': 'public, max-age=600, must-revalidate' // Cache index.html for 10 minutes
              },
              status: 200
            });
          } else {
            response = new Response('Not Found', { status: 404 });
          }
        } else {
          response = new Response('Not Found', { status: 404 });
        }
      } else {
        // Set appropriate headers
        const headers = new Headers();
        // R2's writeHttpMetadata sets Content-Type and ETag
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag); // Ensure ETag is explicitly set, writeHttpMetadata should handle it too.

        // Override content type if needed (your existing logic is good)
        if (key.endsWith('.css')) {
          headers.set('Content-Type', 'text/css');
        } else if (key.endsWith('.js')) {
          headers.set('Content-Type', 'application/javascript');
        } else if (key.endsWith('.json')) {
          headers.set('Content-Type', 'application/json');
        } else if (key.endsWith('.png')) {
          headers.set('Content-Type', 'image/png');
        } else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) {
          headers.set('Content-Type', 'image/jpeg');
        } else if (key.endsWith('.svg')) {
          headers.set('Content-Type', 'image/svg+xml');
        } else if (key.endsWith('.html')) {
          headers.set('Content-Type', 'text/html');
        } else {
          headers.set('Content-Type', 'application/octet-stream');
        }

        // Set Cache-Control for Cloudflare CDN caching and browser caching
        // For static assets, you want long cache times. 'immutable' is great.
        if (object.httpEtag) { // Check if ETag is present for immutable
            headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year, immutable
        } else {
            headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        }

        // Enable CORS
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        headers.set('Access-Control-Allow-Headers', '*');

        response = new Response(object.body, { headers });
      }

      // Handle CORS preflight requests (needs to be *before* caching the response)
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers,
          status: 204
        });
      }

      // Cache the response if it's a successful GET request
      if (request.method === 'GET' && response.status === 200) {
        event.waitUntil(cache.put(cacheKey, response.clone()));
      }

    } catch (error) {
      console.error('Error fetching from R2:', error);
      response = new Response('Error: ' + error.message, { status: 500 });
    }
  }

  return response;
}