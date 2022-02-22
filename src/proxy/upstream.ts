import { Context, Route } from '../types'
import { buildResponse } from '../utils'

export const useUpstream = async (
  context: Context,
  route: Route,
): Promise<void> => {
  const { search } = context.url

  const requestUrl = `${route.upstream.protocol}://${route.upstream.domain}/${route.upstream.path}${search}`

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
    context.logger.error(err as Error, context.request)

    context.response = buildResponse((err as Error).message, 500)
  }
}
