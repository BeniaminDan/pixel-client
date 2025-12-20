/**
 * @fileoverview Validation-related errors
 */

import { BaseError, ErrorCategory, ErrorSeverity } from "@/server/http/infrastructure";

export class ValidationError extends BaseError {
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

export class InvalidInputError extends BaseError {
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
