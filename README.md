# cf proxy

Simple lightweight reverse proxy written for cloudflare workers

## Setup

### Routes

In order for the proxy to work you must pass array of routes to `useProxy` function in `main.ts` file. Example route object below:

```js
  {
    path: '/',
    methods: ['GET', 'POST'],
    headers: {
      response: {
        'x-powered-by': 'cfproxy',
      },
      request: {
        accept: '*/*',
      },
    },
    upstream: {
      path: '/',
      protocol: 'https',
      domain: 'google.com',
      timeout: 3000,
    },
  },
```

## Sentry

You can use sentry for logging errors in cf-proxy. To do that you need to provide valid config to `createLogger` function
