import { createSentryLogger } from '../logger/sentry'
import { Context, Route } from '../types'
import { buildResponse } from '../utils'
import { setHeaders } from './headers'
import { useUpstream } from './upstream'

type Handler = (request: Request) => Promise<Response>

export const useProxy = (routes: Route[]): Handler => {
  const logger = createSentryLogger({
    clientName: 'cf-proxy',
    clientVersion: '1.0.0',
    sentryProjectId: '',
    sentryKey: '',

    enviroment: 'development',
  })

  const handler = async (request: Request) => {
    const context: Context = {
      url: new URL(request.url),
      request,
      response: buildResponse('unhandled request', 501),
      logger,
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
  route.methods.includes(request.method.toUpperCase()) &&
  route.path === url.pathname
