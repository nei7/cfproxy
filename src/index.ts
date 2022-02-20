import { useUpstreams } from './proxy/upstream'
import { Upstream } from './types/upstream'

const upstreams: Upstream[] = [
  {
    path: /google/,
    protocol: 'https',
    domain: 'google.com',
    timeout: 3000,
  },
]

addEventListener('fetch', (event) => {
  const handle = useUpstreams(upstreams)

  event.respondWith(handle(event.request))
})
