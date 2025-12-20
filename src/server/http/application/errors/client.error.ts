/**
 * @fileoverview Client-related errors
 */

import { BaseError } from "@/server/http/infrastructure"
import { ErrorCategory, ErrorSeverity } from "@/shared/types/api"

export class NotFoundError extends BaseError {
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

export class ConflictError extends BaseError {
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

export class BadRequestError extends BaseError {
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
