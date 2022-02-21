export interface Upstream {
  path: string
  domain: string
  protocol?: 'http' | 'https'
  port?: number
  timeout?: number
  weight?: number
}

export interface Route {
  path: string
  headers: {
    request?: Record<string, string>
    response?: Record<string, string>
  }
  methods: string[]
  upstream: Upstream
}

export interface Context {
  request: Request
  url: URL

  response: Response
}
