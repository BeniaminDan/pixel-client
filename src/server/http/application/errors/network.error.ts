/**
 * @fileoverview Network-related errors
 */

import { BaseError, ErrorCategory, ErrorSeverity } from "@/server/http/infrastructure";

export class NetworkError extends BaseError {
  constructor(message = 'Network error occurred', originalError?: unknown) {
    super(message, {
      code: 'NETWORK_ERROR',
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      retryable: true,
      originalError,
      userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
    })
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends BaseError {
  constructor(message = 'Request timeout', originalError?: unknown) {
    super(message, {
      code: 'TIMEOUT_ERROR',
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      retryable: true,
      originalError,
      userMessage: 'The request took too long to complete. Please try again.',
    })
    this.name = 'TimeoutError'
  }
}
