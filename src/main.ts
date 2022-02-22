import { useProxy } from './proxy'

addEventListener('fetch', (event) => {
  const handle = useProxy([
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
    {
      path: '/search',
      methods: ['POST'],
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
        path: '/search',
        protocol: 'https',
        domain: 'google.com',
        timeout: 3000,
      },
    },
  ])

  event.respondWith(handle(event.request))
})
