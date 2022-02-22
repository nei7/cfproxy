import { Context, Route, Upstream } from '../types'
import { buildResponse } from '../utils'

export const getURL = (url: string, upstream: Upstream): string => {
  const cloneURL = new URL(url)
  const { domain, port, protocol } = upstream

  cloneURL.hostname = domain

  if (protocol !== undefined) {
    cloneURL.protocol = `${protocol}:`
  }

  if (port === undefined) {
    cloneURL.port = ''
  } else {
    cloneURL.port = port.toString()
  }

  return cloneURL.href
}

export const useUpstream = async (
  context: Context,
  route: Route,
): Promise<void> => {
  if (!route.upstream) {
    context.response = buildResponse('', 500)
    return
  }

  const requestUrl = getURL(context.request.url, route.upstream)

  const request = new Request(requestUrl, {
    method: context.request.method,
    body: context.request.body,
    headers: route.headers.request,
  })

  context.response = await fetch(request)
}
