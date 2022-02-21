import { Context, Route } from '../types'
import { buildResponse } from '../utils'
import { setHeaders } from './headers'
import { useUpstream } from './upstream'

type Handler = (request: Request) => Promise<Response>

export const useProxy = (routes: Route[]): Handler => {
  const handler = async (request: Request) => {
    const context: Context = {
      url: new URL(request.url),
      request,
      response: buildResponse('unhandled request', 400),
    }

    for (const route of routes) {
      if (matchRoute(context, route)) {
        await useUpstream(context, route)

        setHeaders(context.response.headers, route.headers.response || {})
      }
    }

    return context.response
  }

  return handler
}

const matchRoute = ({ url, request }: Context, route: Route): boolean =>
  route.methods.includes(request.method) && route.path === url.pathname
