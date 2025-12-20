/**
 * @fileoverview Manages idempotency for safe request retries
 */

import type { AxiosRequestConfig } from 'axios'
import { DEFAULT_RETRY_CONFIG} from "@/server/http/contracts";

/**
 * Check if an HTTP method is idempotent (safe to retry)
 */
export function isIdempotentMethod(method: string = 'GET'): boolean {
  const idempotentMethods = DEFAULT_RETRY_CONFIG.idempotentMethods
  return idempotentMethods.includes(method.toUpperCase())
}

/**
 * Check if a request is safe to retry based on method and configuration
 */
export function isRequestRetryable(config: AxiosRequestConfig): boolean {
  const method = config.method?.toUpperCase() || 'GET'

  // Check if method is idempotent
  if (!isIdempotentMethod(method)) {
    // Non-idempotent methods (POST, PATCH) should only retry if explicitly marked
    return config.headers?.['Idempotency-Key'] !== undefined
  }

  return true
}

/**
 * Generate a unique idempotency key for a request
 */
export function generateIdempotencyKey(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${random}`
}

/**
 * Add idempotency key to request headers
 */
export function addIdempotencyKey(config: AxiosRequestConfig): AxiosRequestConfig {
  const method = config.method?.toUpperCase() || 'GET'

  // Only add idempotency key for non-idempotent methods
  if (!isIdempotentMethod(method)) {
    config.headers = config.headers || {}

    // Only add if not already present
    if (!config.headers['Idempotency-Key']) {
      config.headers['Idempotency-Key'] = generateIdempotencyKey()
    }
  }

  return config
}

/**
 * Get idempotency key from request config
 */
export function getIdempotencyKey(config: AxiosRequestConfig): string | undefined {
  return config.headers?.['Idempotency-Key']
}

/**
 * Check if request has idempotency key
 */
export function hasIdempotencyKey(config: AxiosRequestConfig): boolean {
  return getIdempotencyKey(config) !== undefined
}

/**
 * Idempotency configuration for a request
 */
export interface IdempotencyConfig {
  /** Whether to automatically add idempotency keys to non-idempotent requests */
  autoAddKeys: boolean
  /** Custom idempotency key (if not auto-generated) */
  customKey?: string
}

/**
 * Default idempotency configuration
 */
export const DEFAULT_IDEMPOTENCY_CONFIG: IdempotencyConfig = {
  autoAddKeys: true,
}

/**
 * Apply idempotency configuration to a request
 */
export function applyIdempotencyConfig(
  config: AxiosRequestConfig,
  idempotencyConfig: IdempotencyConfig = DEFAULT_IDEMPOTENCY_CONFIG
): AxiosRequestConfig {
  const { autoAddKeys, customKey } = idempotencyConfig

  // Add custom key if provided
  if (customKey) {
    config.headers = config.headers || {}
    config.headers['Idempotency-Key'] = customKey
    return config
  }

  // Auto-add keys if enabled
  if (autoAddKeys) {
    return addIdempotencyKey(config)
  }

  return config
}
