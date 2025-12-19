/**
 * @fileoverview Retry strategy with exponential backoff
 */

import type { RetryConfig } from './RetryConfig'
import { DEFAULT_RETRY_CONFIG } from './RetryConfig'

export interface RetryContext {
  /** Current attempt number (0-indexed) */
  attemptNumber: number
  /** Total number of attempts made so far */
  totalAttempts: number
  /** Error from the last attempt */
  lastError?: unknown
  /** Timestamp of the first attempt */
  startTime: number
  /** Timestamp of the last attempt */
  lastAttemptTime: number
}

/**
 * Calculate retry delay using exponential backoff
 */
export function calculateRetryDelay(
  attemptNumber: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const { initialDelay, backoffMultiplier, maxDelay, useJitter } = config

  // Calculate exponential delay
  let delay = initialDelay * Math.pow(backoffMultiplier, attemptNumber)

  // Cap at maximum delay
  delay = Math.min(delay, maxDelay)

  // Add jitter to prevent thundering herd
  if (useJitter) {
    // Add random jitter between 0% and 25% of the delay
    const jitter = delay * 0.25 * Math.random()
    delay = delay + jitter
  }

  return Math.floor(delay)
}

/**
 * Determine if a request should be retried
 */
export function shouldRetry(
  context: RetryContext,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  const { attemptNumber } = context
  const { maxAttempts } = config

  // Check if max attempts reached
  if (attemptNumber >= maxAttempts) {
    return false
  }

  // Always allow retry if we haven't exceeded max attempts
  return true
}

/**
 * Wait for a specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Execute a function with retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onRetry?: (context: RetryContext) => void
): Promise<T> {
  const context: RetryContext = {
    attemptNumber: 0,
    totalAttempts: 0,
    startTime: Date.now(),
    lastAttemptTime: Date.now(),
  }

  while (true) {
    try {
      // Execute the function
      const result = await fn()
      return result
    } catch (error) {
      // Update context
      context.lastError = error
      context.totalAttempts++
      context.lastAttemptTime = Date.now()

      // Check if should retry
      if (!shouldRetry(context, config)) {
        throw error
      }

      // Calculate delay
      const retryDelay = calculateRetryDelay(context.attemptNumber, config)

      // Call onRetry callback
      if (onRetry) {
        onRetry(context)
      }

      // Log retry attempt
      console.debug(
        `Retrying request (attempt ${context.totalAttempts + 1}/${config.maxAttempts}) after ${retryDelay}ms`
      )

      // Wait before retrying
      await delay(retryDelay)

      // Increment attempt number for next iteration
      context.attemptNumber++
    }
  }
}

/**
 * Create a retry context for tracking retry state
 */
export function createRetryContext(): RetryContext {
  return {
    attemptNumber: 0,
    totalAttempts: 0,
    startTime: Date.now(),
    lastAttemptTime: Date.now(),
  }
}

/**
 * Get total elapsed time from retry context
 */
export function getElapsedTime(context: RetryContext): number {
  return Date.now() - context.startTime
}

/**
 * Get time since last attempt from retry context
 */
export function getTimeSinceLastAttempt(context: RetryContext): number {
  return Date.now() - context.lastAttemptTime
}
