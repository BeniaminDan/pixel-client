/**
 * @fileoverview Retry configuration for API requests
 */

import { RetryConfig } from "@/server/http/contracts"

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  backoffMultiplier: 2,
  maxDelay: 30000, // 30 seconds
  useJitter: true,
  retryableStatusCodes: [
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ],
  idempotentMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'],
  retryOnNetworkError: true,
  retryOnTimeout: true,
}

/**
 * Retry configuration presets for different scenarios
 */
export const RETRY_PRESETS = {
  /** Conservative retry (fewer attempts, longer delays) */
  CONSERVATIVE: {
    ...DEFAULT_RETRY_CONFIG,
    maxAttempts: 2,
    initialDelay: 2000,
    backoffMultiplier: 3,
  } as RetryConfig,

  /** Aggressive retry (more attempts, shorter delays) */
  AGGRESSIVE: {
    ...DEFAULT_RETRY_CONFIG,
    maxAttempts: 5,
    initialDelay: 500,
    backoffMultiplier: 1.5,
  } as RetryConfig,

  /** No retry */
  NONE: {
    ...DEFAULT_RETRY_CONFIG,
    maxAttempts: 0,
  } as RetryConfig,

  /** Quick retry (for real-time operations) */
  QUICK: {
    ...DEFAULT_RETRY_CONFIG,
    maxAttempts: 2,
    initialDelay: 500,
    backoffMultiplier: 2,
    maxDelay: 5000,
  } as RetryConfig,
} as const
