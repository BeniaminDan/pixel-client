// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://818f23943484f398201a6beb2a307b70@o4507944515665920.ingest.de.sentry.io/4510522413744208",

  // Environment
  environment: process.env.NODE_ENV,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.breadcrumbsIntegration({
      // Capture console logs as breadcrumbs
      console: process.env.NODE_ENV === 'development',
      // Capture DOM events
      dom: true,
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

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
      runtime: 'client',
    },
  },

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    // Network errors that are expected
    'NetworkError',
    'Network request failed',
    // Aborted requests
    'AbortError',
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
