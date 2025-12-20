/**
 * @fileoverview Server-related errors
 */

import { BaseError, ErrorCategory, ErrorSeverity } from "@/server/http/infrastructure";

export class ServerError extends BaseError {
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

export class ServiceUnavailableError extends BaseError {
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
