export function buildResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
  })
}
