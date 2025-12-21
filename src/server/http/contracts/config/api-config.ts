/**
 * @fileoverview Centralized API configuration
 */

import { ApiConfig, DEFAULT_RETRY_CONFIG } from "@/server/http/contracts"

/**
 * Get API base URL from environment
 */
function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:3001/api'
}

/**
 * Default API configuration
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  retry: DEFAULT_RETRY_CONFIG,
  logging: {
    enabled: true,
    sentry: process.env.NODE_ENV === 'production',
    console: process.env.NODE_ENV === 'development',
  },
  withCredentials: true,
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

/**
 * Public API configuration (no auth, no retries)
 */
export const PUBLIC_API_CONFIG: Partial<ApiConfig> = {
  ...DEFAULT_API_CONFIG,
  retry: {
    ...DEFAULT_RETRY_CONFIG,
    maxAttempts: 2, // Fewer retries for public endpoints
  },
}

/**
 * Authenticated API configuration
 */
export const AUTHENTICATED_API_CONFIG: Partial<ApiConfig> = {
  ...DEFAULT_API_CONFIG,
}