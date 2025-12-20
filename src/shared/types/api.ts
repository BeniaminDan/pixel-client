// --- API & NETWORKING ---

/** Standard shape for query parameters in HTTP helpers. */
export type QueryParamValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryParamValue>

/** Metadata used for paginated responses. */
export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  pageCount?: number
}

/** Canonical API response envelope. */
export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: PaginationMeta
}

/** Expected error payload shape from the API. */
export interface ApiErrorPayload {
  message?: string
  code?: string
  status?: number
  errors?: Record<string, string[]>
}

/** Normalized client-side API error. */
export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: Record<string, string[]>
}

/** Helper result type for safe API calls. */
export type ApiResult<T> =
  | {
      data: T
      error: null
    }
  | {
      data: null
      error: ApiError
    }

// --- AUTHENTICATION RESPONSE TYPES ---

/** Response from authentication endpoints */
export interface AuthResponse {
  success: boolean
  message?: string
  requiresEmailConfirmation?: boolean
}

/** Response from email confirmation */
export interface EmailConfirmationResponse {
  success: boolean
  message?: string
}

/** Response from password reset */
export interface PasswordResetResponse {
  success: boolean
  message?: string
}

/** Generic action response for server actions */
export interface ActionResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

/** Validation error response from API */
export interface ValidationErrorResponse {
  type: string
  title: string
  status: number
  errors: Record<string, string[]>
}




