export const setHeaders = (
  target: Headers,
  headers: Record<string, string>,
): void => {
  for (const [key, value] of Object.entries(headers)) {
    target.append(key, value)
  }
}
