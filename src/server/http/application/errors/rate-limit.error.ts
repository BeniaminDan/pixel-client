/**
 * @fileoverview Rate limiting errors
 */

import { BaseError, ErrorCategory, ErrorSeverity } from "@/server/http/infrastructure";

export class RateLimitError extends BaseError {
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
