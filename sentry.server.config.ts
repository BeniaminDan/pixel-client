// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://818f23943484f398201a6beb2a307b70@o4507944515665920.ingest.de.sentry.io/4510522413744208",

  // Environment
  environment: process.env.NODE_ENV,

  // Integrations for server-side
  integrations: [
    Sentry.httpIntegration(),
    Sentry.breadcrumbsIntegration({
      // Capture console logs
      console: process.env.NODE_ENV === 'development',
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false, // Changed to false for privacy

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers.authorization
      delete event.request.headers.cookie
    }

    // Remove sensitive data from request body
    if (event.request?.data) {
      const data = event.request.data as Record<string, unknown>
      const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard']
      
      sensitiveFields.forEach((field) => {
        if (field in data) {
          data[field] = '***REDACTED***'
        }
      })
    }

    // Filter API errors to avoid noise
    if (event.exception?.values) {
      const isApiError = event.exception.values.some(
        (value) => value.type === 'ApiError'
      )
      
      // Don't send low-severity API errors in production
      if (isApiError && process.env.NODE_ENV === 'production') {
        const severity = event.contexts?.api_error?.severity
        if (severity === 'low') {
          return null
        }
      }
    }

    return event
  },

  // Add tags for better filtering
  initialScope: {
    tags: {
      runtime: 'server',
    },
  },

  // Ignore specific errors
  ignoreErrors: [
    // Expected network errors
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    // Client disconnection is normal
    'ECONNRESET',
    // Request aborted by client
    'AbortError',
  ],
});
