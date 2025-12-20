/**
 * @fileoverview Permission-related errors
 */

import { BaseError } from "@/server/http/infrastructure"
import { ErrorCategory, ErrorSeverity } from "@/shared/types/api"

export class ForbiddenError extends BaseError {
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

export class InsufficientPermissionsError extends BaseError {
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
