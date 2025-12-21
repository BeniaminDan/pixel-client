import {ApiConfig, DEFAULT_API_CONFIG, DEFAULT_RETRY_CONFIG, RetryConfig} from "@/server";


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

/**
 * Merge custom retry config with defaults
 */
export function createRetryConfig(custom: Partial<RetryConfig> = {}): RetryConfig {
  return {
    ...DEFAULT_RETRY_CONFIG,
    ...custom,
  }
}