/**
 * @fileoverview Axios interceptor for automatic retries with exponential backoff
 */

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { RetryConfig } from './RetryConfig'
import { DEFAULT_RETRY_CONFIG } from './RetryConfig'
import { calculateRetryDelay, createRetryContext, type RetryContext } from './RetryStrategy'
import { isRequestRetryable } from './IdempotencyManager'
import { isRetryableError } from '../errors'

// Symbol to track retry count on request config
const RETRY_COUNT_SYMBOL = Symbol('retryCount')
const RETRY_CONTEXT_SYMBOL = Symbol('retryContext')

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  [RETRY_COUNT_SYMBOL]?: number
  [RETRY_CONTEXT_SYMBOL]?: RetryContext
}

/**
 * Determine if an error should trigger a retry
 */
function shouldRetryError(
  error: AxiosError,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  // No response (network error)
  if (!error.response) {
    // Check if it's a timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return config.retryOnTimeout
    }
    // Other network errors
    return config.retryOnNetworkError
  }

  // Check status code
  const status = error.response.status
  return config.retryableStatusCodes.includes(status)
}

/**
 * Wait for a specified delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Attach retry interceptor to an Axios instance
 */
export function attachRetryInterceptor(
  axiosInstance: AxiosInstance,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): void {
  axiosInstance.interceptors.response.use(
    // Success response - pass through
    (response) => response,

    // Error response - apply retry logic
    async (error: AxiosError) => {
      const config = error.config as RetryableAxiosRequestConfig | undefined

      // Can't retry without config
      if (!config) {
        return Promise.reject(error)
      }

      // Check if request is retryable based on method/idempotency
      if (!isRequestRetryable(config)) {
        return Promise.reject(error)
      }

      // Check if error is retryable
      if (!shouldRetryError(error, retryConfig)) {
        return Promise.reject(error)
      }

      // Check using error mapper
      if (!isRetryableError(error)) {
        return Promise.reject(error)
      }

      // Initialize retry count and context if not present
      if (!config[RETRY_COUNT_SYMBOL]) {
        config[RETRY_COUNT_SYMBOL] = 0
        config[RETRY_CONTEXT_SYMBOL] = createRetryContext()
      }

      const retryCount = config[RETRY_COUNT_SYMBOL]
      const retryContext = config[RETRY_CONTEXT_SYMBOL]!

      // Check if max retries exceeded
      if (retryCount >= retryConfig.maxAttempts) {
        console.debug(
          `Max retry attempts (${retryConfig.maxAttempts}) exceeded for ${config.method?.toUpperCase()} ${config.url}`
        )
        return Promise.reject(error)
      }

      // Calculate delay
      const retryDelay = calculateRetryDelay(retryCount, retryConfig)

      // Update retry context
      retryContext.attemptNumber = retryCount
      retryContext.totalAttempts = retryCount + 1
      retryContext.lastError = error
      retryContext.lastAttemptTime = Date.now()

      // Log retry attempt
      console.debug(
        `Retrying ${config.method?.toUpperCase()} ${config.url} (attempt ${retryCount + 1}/${retryConfig.maxAttempts}) after ${retryDelay}ms`
      )

      // Increment retry count
      config[RETRY_COUNT_SYMBOL] = retryCount + 1

      // Wait before retrying
      await delay(retryDelay)

      // Retry the request
      return axiosInstance.request(config)
    }
  )
}

/**
 * Get retry count from request config
 */
export function getRetryCount(config: RetryableAxiosRequestConfig): number {
  return config[RETRY_COUNT_SYMBOL] || 0
}

/**
 * Get retry context from request config
 */
export function getRetryContext(config: RetryableAxiosRequestConfig): RetryContext | undefined {
  return config[RETRY_CONTEXT_SYMBOL]
}

/**
 * Reset retry count on request config
 */
export function resetRetryCount(config: RetryableAxiosRequestConfig): void {
  delete config[RETRY_COUNT_SYMBOL]
  delete config[RETRY_CONTEXT_SYMBOL]
}
