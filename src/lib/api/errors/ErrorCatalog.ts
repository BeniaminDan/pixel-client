/**
 * @fileoverview Catalog of predefined API errors with categorization
 */

import { ApiError, ErrorCategory, ErrorSeverity } from './ApiError'

/**
 * Network Errors
 */
export class NetworkError extends ApiError {
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

export class TimeoutError extends ApiError {
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

/**
 * Authentication Errors
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', originalError?: unknown) {
    super(message, {
      code: 'UNAUTHORIZED',
      status: 401,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.HIGH,
      retryable: false,
      originalError,
      userMessage: 'You are not authorized. Please sign in and try again.',
    })
    this.name = 'UnauthorizedError'
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token expired', originalError?: unknown) {
    super(message, {
      code: 'TOKEN_EXPIRED',
      status: 401,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.MEDIUM,
      retryable: true,
      originalError,
      userMessage: 'Your session has expired. Please sign in again.',
    })
    this.name = 'TokenExpiredError'
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor(message = 'Invalid credentials', originalError?: unknown) {
    super(message, {
      code: 'INVALID_CREDENTIALS',
      status: 401,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.LOW,
      retryable: false,
      originalError,
      userMessage: 'Invalid email or password. Please try again.',
    })
    this.name = 'InvalidCredentialsError'
  }
}

/**
 * Permission Errors
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', originalError?: unknown) {
    super(message, {
      code: 'FORBIDDEN',
      status: 403,
      category: ErrorCategory.PERMISSION,
      severity: ErrorSeverity.MEDIUM,
      retryable: false,
      originalError,
      userMessage: 'You do not have permission to perform this action.',
    })
    this.name = 'ForbiddenError'
  }
}

export class InsufficientPermissionsError extends ApiError {
  constructor(requiredPermission?: string, originalError?: unknown) {
    const message = requiredPermission
      ? `Insufficient permissions: ${requiredPermission} required`
      : 'Insufficient permissions'

    super(message, {
      code: 'INSUFFICIENT_PERMISSIONS',
      status: 403,
      category: ErrorCategory.PERMISSION,
      severity: ErrorSeverity.MEDIUM,
      retryable: false,
      originalError,
      userMessage: 'You do not have the required permissions to access this resource.',
    })
    this.name = 'InsufficientPermissionsError'
  }
}

/**
 * Validation Errors
 */
export class ValidationError extends ApiError {
  constructor(
    message = 'Validation failed',
    details?: Record<string, string[]>,
    originalError?: unknown
  ) {
    super(message, {
      code: 'VALIDATION_ERROR',
      status: 400,
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      retryable: false,
      originalError,
      details,
      userMessage: 'Please check your input and try again.',
    })
    this.name = 'ValidationError'
  }
}

export class InvalidInputError extends ApiError {
  constructor(field?: string, originalError?: unknown) {
    const message = field ? `Invalid input: ${field}` : 'Invalid input'

    super(message, {
      code: 'INVALID_INPUT',
      status: 400,
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      retryable: false,
      originalError,
      userMessage: field ? `Invalid value for ${field}` : 'Invalid input provided.',
    })
    this.name = 'InvalidInputError'
  }
}

/**
 * Server Errors
 */
export class ServerError extends ApiError {
  constructor(message = 'Internal server error', status = 500, originalError?: unknown) {
    super(message, {
      code: 'SERVER_ERROR',
      status,
      category: ErrorCategory.SERVER,
      severity: ErrorSeverity.HIGH,
      retryable: true,
      originalError,
      userMessage: 'Something went wrong on our end. Please try again later.',
    })
    this.name = 'ServerError'
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message = 'Service unavailable', originalError?: unknown) {
    super(message, {
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
      category: ErrorCategory.SERVER,
      severity: ErrorSeverity.CRITICAL,
      retryable: true,
      originalError,
      userMessage: 'The service is temporarily unavailable. Please try again later.',
    })
    this.name = 'ServiceUnavailableError'
  }
}

/**
 * Rate Limiting Errors
 */
export class RateLimitError extends ApiError {
  constructor(retryAfter?: number, originalError?: unknown) {
    const message = retryAfter
      ? `Rate limit exceeded. Retry after ${retryAfter} seconds`
      : 'Rate limit exceeded'

    super(message, {
      code: 'RATE_LIMIT_EXCEEDED',
      status: 429,
      category: ErrorCategory.RATE_LIMIT,
      severity: ErrorSeverity.MEDIUM,
      retryable: true,
      originalError,
      userMessage: 'You have made too many requests. Please wait a moment and try again.',
    })
    this.name = 'RateLimitError'
  }
}

/**
 * Client Errors
 */
export class NotFoundError extends ApiError {
  constructor(resource = 'Resource', originalError?: unknown) {
    super(`${resource} not found`, {
      code: 'NOT_FOUND',
      status: 404,
      category: ErrorCategory.CLIENT,
      severity: ErrorSeverity.LOW,
      retryable: false,
      originalError,
      userMessage: `The requested ${resource.toLowerCase()} could not be found.`,
    })
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', originalError?: unknown) {
    super(message, {
      code: 'CONFLICT',
      status: 409,
      category: ErrorCategory.CLIENT,
      severity: ErrorSeverity.LOW,
      retryable: false,
      originalError,
      userMessage: 'This resource already exists or conflicts with an existing resource.',
    })
    this.name = 'ConflictError'
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', originalError?: unknown) {
    super(message, {
      code: 'BAD_REQUEST',
      status: 400,
      category: ErrorCategory.CLIENT,
      severity: ErrorSeverity.LOW,
      retryable: false,
      originalError,
      userMessage: 'The request could not be processed. Please check your input.',
    })
    this.name = 'BadRequestError'
  }
}

/**
 * Unknown Errors
 */
export class UnknownError extends ApiError {
  constructor(message = 'An unknown error occurred', originalError?: unknown) {
    super(message, {
      code: 'UNKNOWN_ERROR',
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      retryable: false,
      originalError,
      userMessage: 'An unexpected error occurred. Please try again.',
    })
    this.name = 'UnknownError'
  }
}
