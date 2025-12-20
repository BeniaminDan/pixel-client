/**
 * @fileoverview Authentication-related errors
 */

import { BaseError, ErrorCategory, ErrorSeverity } from "@/server/http/infrastructure";

export class UnauthorizedError extends BaseError {
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

export class TokenExpiredError extends BaseError {
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

export class InvalidCredentialsError extends BaseError {
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
