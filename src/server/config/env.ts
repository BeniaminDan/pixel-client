/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  // API Configuration
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  
  // Auth Configuration (NextAuth)
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '',
  
  // OpenIddict Configuration
  OPENIDDICT_ISSUER: process.env.OPENIDDICT_ISSUER || '',
  OPENIDDICT_CLIENT_ID: process.env.OPENIDDICT_CLIENT_ID || '',
  OPENIDDICT_CLIENT_SECRET: process.env.OPENIDDICT_CLIENT_SECRET || '',
  
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Sentry Configuration
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || '',
} as const

