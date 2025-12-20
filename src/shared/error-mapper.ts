/**
 * @fileoverview Maps various error types to standardized ApiError instances
 */

import type { AxiosError } from 'axios'
import { BaseError } from "@/server/http/infrastructure";
import {
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  TokenExpiredError,
  ForbiddenError,
  ValidationError,
  ServerError,
  ServiceUnavailableError,
  RateLimitError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnknownError
} from "@/server/http/application/errors";

interface ApiErrorPayload {
  message?: string
  error?: string
  code?: string
  status?: number
  errors?: Record<string, string[]>
}

/**
 * Map Axios errors to typed ApiError instances
 */
export function mapAxiosError(error: AxiosError<ApiErrorPayload>): BaseError {
  // Network errors (no response received)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new TimeoutError(error.message, error)
    }
    return new NetworkError(error.message, error)
  }

  const { status, data } = error.response
  const message = data?.message || data?.error || error.message

  // Map by HTTP status code
  switch (status) {
    case 400:
      if (data?.errors) {
        return new ValidationError(message, data.errors, error)
      }
      return new BadRequestError(message, error)

    case 401:
      if (message.toLowerCase().includes('expired')) {
        return new TokenExpiredError(message, error)
      }
      return new UnauthorizedError(message, error)

    case 403:
      return new ForbiddenError(message, error)

    case 404:
      return new NotFoundError('Resource', error)

    case 409:
      return new ConflictError(message, error)

    case 429:
      const retryAfter = error.response.headers['retry-after']
      const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : undefined
      return new RateLimitError(retrySeconds, error)

    case 500:
    case 502:
    case 504:
      return new ServerError(message, status, error)

    case 503:
      return new ServiceUnavailableError(message, error)

    default:
      if (status >= 500) {
        return new ServerError(message, status, error)
      }
      return new UnknownError(message, error)
  }
}

/**
 * Map generic errors to ApiError instances
 */
export function mapGenericError(error: unknown): BaseError {
  // Already an ApiError
  if (error instanceof BaseError) {
    return error
  }

  // Axios error
  if (isAxiosError(error)) {
    return mapAxiosError(error)
  }

  // Standard Error
  if (error instanceof Error) {
    return new UnknownError(error.message, error)
  }

  // String error
  if (typeof error === 'string') {
    return new UnknownError(error, error)
  }

  // Unknown error type
  return new UnknownError('An unexpected error occurred', error)
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError<ApiErrorPayload> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    error.isAxiosError === true
  )
}

/**
 * Extract user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  const apiError = mapGenericError(error)
  return apiError.userMessage
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const apiError = mapGenericError(error)
  return apiError.isRetryable()
}

/**
 * Get error details for logging
 */
export function getErrorDetails(error: unknown) {
  const apiError = mapGenericError(error)
  return {
    message: apiError.message,
    code: apiError.code,
    status: apiError.status,
    category: apiError.category,
    severity: apiError.severity,
    retryable: apiError.retryable,
    userMessage: apiError.userMessage,
    details: apiError.details,
    timestamp: apiError.timestamp,
  }
}
