import { Upstream } from '../types/upstream'

type Handler = (request: Request) => Promise<Response>

export const useUpstreams = (upstreams: Upstream[]): Handler => {
  const handler = async (request: Request) => {
    for (const upstream of upstreams) {
      const route = matchRoute(upstream, request)
      if (!route) {
        return new Response('no response')
      }

      return execute(request, upstream)
    }

    return new Response('')
  }

  return handler
}

const matchRoute = (upstream: Upstream, request: Request): Upstream | void => {
  const url = new URL(request.url)
  if (upstream.path.test(url.pathname)) {
    return upstream
  }
  return undefined
}

const execute = async (
  { method, headers, body, url }: Request,
  upstream: Upstream,
): Promise<Response> => {
  const controller = new AbortController()
  const { pathname, search } = new URL(url)

  const endpoint = pathname.replace(upstream.path, '')

  const requestUrl = `${upstream.protocol}://${upstream.domain}/${endpoint}${search}`
  console.log(requestUrl)
  try {
    const request = new Request(requestUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
    })

    setTimeout(() => controller.abort(), upstream.timeout || 30000)

    const response = await fetch(request)

    return response
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
    })
  }
}
