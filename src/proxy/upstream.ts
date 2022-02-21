import { Context, Route } from '../types'
import { buildResponse } from '../utils'

export const useUpstream = async (
  context: Context,
  route: Route,
): Promise<void> => {
  const { pathname, search } = context.url
  const endpoint = pathname.replace(route.upstream.path, '')

  const requestUrl = `${route.upstream.protocol}://${route.upstream.domain}/${endpoint}${search}`

  try {
    const controller = new AbortController()
    const request = new Request(requestUrl, {
      method: context.request.method,
      headers: route.headers.request,
      signal: controller.signal,
    })

    setTimeout(() => controller.abort(), route.upstream.timeout || 30000)

    const response = await fetch(request)

    context.response = response
  } catch (err) {
    context.response = buildResponse((err as Error).message, 500)
  }
}
