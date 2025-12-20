/**
 * @fileoverview Unknown/unexpected errors
 */

import { BaseError } from "@/server/http/infrastructure"
import { ErrorCategory, ErrorSeverity } from "@/shared/types/api"

export class UnknownError extends BaseError {
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
