import { useProxy } from './proxy'
import { Route } from './types'

const routes: Route[] = [
  {
    path: '/',
    methods: ['GET', 'POST'],
    headers: {
      response: {
        'x-powered-by': 'cfproxy',
      },
      request: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
        accept: '*/*',
      },
    },
    upstream: {
      path: '/',
      protocol: 'https',
      domain: 'google.com',
      timeout: 3000,
    },
  },
]

addEventListener('fetch', (event) => {
  const handle = useProxy(routes)

  event.respondWith(handle(event.request))
})
