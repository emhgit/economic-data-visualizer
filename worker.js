addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  let path = url.pathname

  // Default to index.html for root path
  if (path === '/') {
    path = '/index.html'
  }

  // Remove leading slash for R2 key
  const key = path.startsWith('/') ? path.slice(1) : path

  try {
    // Get the object from R2
    const object = await ECONOMIC_DATA_VISUALIZER.get(key)

    if (object === null) {
      // If file not found, try serving index.html for SPA routing
      if (path.endsWith('.html') || path.indexOf('.') === -1) {
        const index = await ECONOMIC_DATA_VISUALIZER.get('index.html')
        if (index !== null) {
          return new Response(index.body, {
            headers: { 'Content-Type': 'text/html' },
            status: 200
          })
        }
      }
      return new Response('Not Found', { status: 404 })
    }

    // Set appropriate headers
    const headers = new Headers()
    headers.set('etag', object.httpEtag)

    // Set content type based on file extension
    if (key.endsWith('.css')) {
      headers.set('Content-Type', 'text/css')
    } else if (key.endsWith('.js')) {
      headers.set('Content-Type', 'application/javascript')
    } else if (key.endsWith('.json')) {
      headers.set('Content-Type', 'application/json')
    } else if (key.endsWith('.png')) {
      headers.set('Content-Type', 'image/png')
    } else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) {
      headers.set('Content-Type', 'image/jpeg')
    } else if (key.endsWith('.svg')) {
      headers.set('Content-Type', 'image/svg+xml')
    } else if (key.endsWith('.html')) {
      headers.set('Content-Type', 'text/html')
    } else {
      headers.set('Content-Type', 'application/octet-stream')
    }

    // Enable CORS
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    headers.set('Access-Control-Allow-Headers', '*')

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers,
        status: 204
      })
    }

    return new Response(object.body, {
      headers
    })

  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 })
  }
}
