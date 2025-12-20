/**
 * @fileoverview Centralized API configuration
 */

import type { RetryConfig } from "@/server/http/contracts"
import { DEFAULT_RETRY_CONFIG } from "@/server/http/contracts";

export interface ApiConfig {
  /** Base URL for the API */
  baseURL: string
  /** Request timeout in milliseconds */
  timeout: number
  /** Retry configuration */
  retry: RetryConfig
  /** Logging configuration */
  logging: {
    /** Enable logging */
    enabled: boolean
    /** Enable Sentry logging */
    sentry: boolean
    /** Enable console logging */
    console: boolean
  }
  /** Whether to use credentials (cookies) */
  withCredentials: boolean
  /** Default headers */
  defaultHeaders: Record<string, string>
}

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

/**
 * Admin API configuration (stricter timeouts, more logging)
 */
export const ADMIN_API_CONFIG: Partial<ApiConfig> = {
  ...DEFAULT_API_CONFIG,
  timeout: 60000, // 60 seconds for admin operations
  retry: {
    ...DEFAULT_RETRY_CONFIG,
    maxAttempts: 2, // Fewer retries for admin endpoints
  },
}

/**
 * Create custom API configuration
 */
export function createApiConfig(custom: Partial<ApiConfig> = {}): ApiConfig {
  return {
    ...DEFAULT_API_CONFIG,
    ...custom,
    retry: {
      ...DEFAULT_API_CONFIG.retry,
      ...custom.retry,
    },
    logging: {
      ...DEFAULT_API_CONFIG.logging,
      ...custom.logging,
    },
    defaultHeaders: {
      ...DEFAULT_API_CONFIG.defaultHeaders,
      ...custom.defaultHeaders,
    },
  }
}
