/**
 * @fileoverview Global error handler with recovery strategies
 */

import { toast } from 'sonner'
import { ApiError, ErrorCategory, ErrorSeverity } from '@/lib/api'
import { mapGenericError } from '@/lib/api'

export interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  rethrow?: boolean
  customMessage?: string
  onError?: (error: ApiError) => void
}

/**
 * Global error handler with recovery strategies
 */
export class ErrorHandler {
  /**
   * Handle an error with appropriate recovery strategy
   */
  static handle(error: unknown, options: ErrorHandlerOptions = {}): ApiError {
    const {
      showToast = true,
      logError = true,
      rethrow = false,
      customMessage,
      onError,
    } = options

    const apiError = mapGenericError(error)

    // Log error
    if (logError) {
      this.logError(apiError)
    }

    // Show user notification
    if (showToast) {
      this.showUserNotification(apiError, customMessage)
    }

    // Custom error callback
    if (onError) {
      onError(apiError)
    }

    // Rethrow if requested
    if (rethrow) {
      throw apiError
    }

    return apiError
  }

  /**
   * Log error to console (and potentially to logging service)
   */
  private static logError(error: ApiError): void {
    const logData = {
      timestamp: error.timestamp.toISOString(),
      code: error.code,
      message: error.message,
      status: error.status,
      category: error.category,
      severity: error.severity,
      retryable: error.retryable,
      details: error.details,
    }

    // Log based on severity
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🔴 CRITICAL ERROR:', logData)
        break
      case ErrorSeverity.HIGH:
        console.error('🟠 HIGH SEVERITY ERROR:', logData)
        break
      case ErrorSeverity.MEDIUM:
        console.warn('🟡 MEDIUM SEVERITY ERROR:', logData)
        break
      case ErrorSeverity.LOW:
        console.info('🔵 LOW SEVERITY ERROR:', logData)
        break
      default:
        console.log('⚪ ERROR:', logData)
    }

    // Log original error stack for debugging
    if (error.originalError instanceof Error && error.originalError.stack) {
      console.debug('Original error stack:', error.originalError.stack)
    }
  }

  /**
   * Show user-friendly notification
   */
  private static showUserNotification(error: ApiError, customMessage?: string): void {
    const message = customMessage || error.userMessage

    // Choose toast type based on category
    switch (error.category) {
      case ErrorCategory.AUTH:
      case ErrorCategory.PERMISSION:
        toast.warning(message, {
          description: 'Please check your credentials and permissions.',
          duration: 5000,
        })
        break

      case ErrorCategory.VALIDATION:
        toast.error(message, {
          description: error.details
            ? this.formatValidationErrors(error.details)
            : 'Please check your input.',
          duration: 5000,
        })
        break

      case ErrorCategory.NETWORK:
        toast.error(message, {
          description: 'Please check your internet connection.',
          duration: 5000,
        })
        break

      case ErrorCategory.SERVER:
        toast.error(message, {
          description: error.retryable
            ? 'We\'re working on it. Please try again later.'
            : undefined,
          duration: 5000,
        })
        break

      case ErrorCategory.RATE_LIMIT:
        toast.warning(message, {
          description: 'Please wait a moment before trying again.',
          duration: 5000,
        })
        break

      default:
        toast.error(message, {
          duration: 5000,
        })
    }
  }

  /**
   * Format validation errors for display
   */
  private static formatValidationErrors(details: Record<string, string[]>): string {
    const errors = Object.entries(details)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .slice(0, 3) // Limit to first 3 errors

    return errors.join('\n')
  }

  /**
   * Handle error silently (no toast, just log)
   */
  static handleSilently(error: unknown): ApiError {
    return this.handle(error, { showToast: false })
  }

  /**
   * Handle error with custom message
   */
  static handleWithMessage(error: unknown, message: string): ApiError {
    return this.handle(error, { customMessage: message })
  }

  /**
   * Get recovery strategy for error
   */
  static getRecoveryStrategy(error: unknown): ErrorRecoveryStrategy {
    const apiError = mapGenericError(error)

    if (apiError.isAuthError()) {
      return ErrorRecoveryStrategy.REDIRECT_TO_LOGIN
    }

    if (apiError.isRetryable()) {
      return ErrorRecoveryStrategy.RETRY
    }

    if (apiError.category === ErrorCategory.VALIDATION) {
      return ErrorRecoveryStrategy.SHOW_VALIDATION
    }

    return ErrorRecoveryStrategy.SHOW_ERROR
  }
}

/**
 * Error recovery strategies
 */
export enum ErrorRecoveryStrategy {
  RETRY = 'retry',
  REDIRECT_TO_LOGIN = 'redirect_to_login',
  SHOW_ERROR = 'show_error',
  SHOW_VALIDATION = 'show_validation',
  IGNORE = 'ignore',
}

/**
 * Convenience function for handling errors in try-catch blocks
 */
export function handleApiError(error: unknown, options?: ErrorHandlerOptions): ApiError {
  return ErrorHandler.handle(error, options)
}

/**
 * Convenience function for handling errors silently
 */
export function handleApiErrorSilently(error: unknown): ApiError {
  return ErrorHandler.handleSilently(error)
}
