export interface Upstream {
  path: RegExp
  domain: string
  protocol?: 'http' | 'https'
  port?: number
  timeout?: number
  weight?: number
}
