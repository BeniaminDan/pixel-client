/**
 * @fileoverview Base API Error class with categorization and metadata
 */

import { ApiErrorOptions, ErrorCategory, ErrorSeverity } from "@/shared/types/api";

/**
 * Enhanced API error class with categorization and metadata
 */
export class BaseError extends Error {
  readonly code: string
  readonly status?: number
  readonly severity: ErrorSeverity
  readonly category: ErrorCategory
  readonly retryable: boolean
  readonly originalError?: unknown
  readonly userMessage: string
  readonly details?: Record<string, string[]>
  readonly timestamp: Date

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    
    this.code = options.code || 'UNKNOWN_ERROR'
    this.status = options.status
    this.severity = options.severity || ErrorSeverity.MEDIUM
    this.category = options.category || ErrorCategory.UNKNOWN
    this.retryable = options.retryable ?? false
    this.originalError = options.originalError
    this.userMessage = options.userMessage || message
    this.details = options.details
    this.timestamp = options.timestamp || new Date()

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      userMessage: this.userMessage,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.retryable
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.category === ErrorCategory.AUTH
  }

  /**
   * Check if error is permission related
   */
  isPermissionError(): boolean {
    return this.category === ErrorCategory.PERMISSION
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.category === ErrorCategory.VALIDATION
  }

  /**
   * Check if error is network related
   */
  isNetworkError(): boolean {
    return this.category === ErrorCategory.NETWORK
  }

  /**
   * Check if error is server related
   */
  isServerError(): boolean {
    return this.category === ErrorCategory.SERVER
  }
}
