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
  url: URL
  request: Request
  response: Response

  logger: Logger
}

export interface SentryLoggerOptions {
  sentryProjectId: string
  sentryKey: string
  clientName: string
  clientVersion: string

  enviroment: string
}

export type Logger = { error: (err: Error, request: Request) => Promise<void> }
