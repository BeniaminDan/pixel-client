/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  // API Configuration
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  API_URL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '',
  
  // Auth Configuration
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
} as const
