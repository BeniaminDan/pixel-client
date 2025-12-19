// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://818f23943484f398201a6beb2a307b70@o4507944515665920.ingest.de.sentry.io/4510522413744208",

  // Environment
  environment: process.env.NODE_ENV,

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

    return event
  },

  // Add tags for better filtering
  initialScope: {
    tags: {
      runtime: 'edge',
    },
  },

  // Ignore specific errors
  ignoreErrors: [
    // Network errors
    'NetworkError',
    'AbortError',
  ],
});
