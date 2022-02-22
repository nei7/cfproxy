import { v4 } from 'uuid'
import { Logger, SentryLoggerOptions } from '../types'

export function createSentryLogger({
  clientName,
  clientVersion,
  sentryKey,
  sentryProjectId,
  enviroment,
}: SentryLoggerOptions): Logger {
  async function error(err: Error, request: Request): Promise<void> {
    const sentryEvent = toSentryEvent(err, request)
    const body = JSON.stringify(sentryEvent)

    console.error(err, sentryEvent)

    const res = await fetch(`https://sentry.io/api/${sentryProjectId}/store/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': [
          'Sentry sentry_version=7',
          `sentry_client=${clientName}/${clientVersion}`,
          `sentry_key=${sentryKey}`,
        ].join(', '),
      },
      body,
    })

    if (res.status === 200) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error({ httpStatus: res.status, ...(await res.json<any>()) })
  }

  function toSentryEvent(err: Error, request?: Request) {
    const frames = parse(err)

    return {
      event_id: v4(),
      message: err.name + ': ' + (err.message || '<no message>'),
      exception: {
        values: [
          {
            type: err.name,
            value: err.message,
            stacktrace: frames.length
              ? { frames: frames.reverse() }
              : undefined,
          },
        ],
      },
      platform: 'javascript',
      environment: enviroment,
      timestamp: Date.now() / 1000,
      request:
        request && request.url
          ? {
              method: request.method,
              url: request.url,
              headers: request.headers,
              data: request.body,
            }
          : undefined,
    }
  }

  return { error }
}

function parse(err: Error) {
  return (err.stack || '')
    .split('\n')
    .slice(1)
    .map((line) => {
      if (line.match(/^\s*[-]{4,}$/)) {
        return { filename: line }
      }

      // From https://github.com/felixge/node-stack-trace/blob/1ec9ba43eece124526c273c917104b4226898932/lib/stack-trace.js#L42
      const lineMatch = line.match(
        /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/,
      )
      if (!lineMatch) {
        return
      }

      return {
        function: lineMatch[1] || undefined,
        filename: lineMatch[2] || undefined,
        lineno: +lineMatch[3] || undefined,
        colno: +lineMatch[4] || undefined,
        in_app: lineMatch[5] !== 'native' || undefined,
      }
    })
    .filter(Boolean)
}
