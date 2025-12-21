export interface ServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number
  /** Initial delay in milliseconds before first retry */
  initialDelay: number
  /** Multiplier for exponential backoff (e.g., 2 means delay doubles each time) */
  backoffMultiplier: number
  /** Maximum delay in milliseconds between retries */
  maxDelay: number
  /** Whether to add jitter to retry delays */
  useJitter: boolean
  /** HTTP status codes that should trigger a retry */
  retryableStatusCodes: number[]
  /** HTTP methods that are safe to retry (idempotent) */
  idempotentMethods: string[]
  /** Retry on network errors (no response received) */
  retryOnNetworkError: boolean
  /** Retry on timeout errors */
  retryOnTimeout: boolean
}

export interface ApiConfig {
  /** Base URL for the API */
  baseURL: string
  /** Request timeout in milliseconds */
  timeout: number
  /** Retry configuration */
  retry: RetryConfig
  /** Logging configuration */
  logging: {
    /** Enable logging */
    enabled: boolean
    /** Enable Sentry logging */
    sentry: boolean
    /** Enable console logging */
    console: boolean
  }
  /** Whether to use credentials (cookies) */
  withCredentials: boolean
  /** Default headers */
  defaultHeaders: Record<string, string>
}