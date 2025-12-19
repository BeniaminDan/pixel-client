/**
 * @fileoverview Unified logger interface for API requests
 */

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  requestId?: string
  userId?: string
  sessionId?: string
  timestamp: Date
  [key: string]: unknown
}

export interface RequestLogData {
  method: string
  url: string
  headers?: Record<string, string>
  data?: unknown
  params?: unknown
  timestamp: Date
}

export interface ResponseLogData {
  status: number
  statusText: string
  headers?: Record<string, string>
  data?: unknown
  duration: number
  timestamp: Date
}

export interface ErrorLogData {
  message: string
  code?: string
  status?: number
  stack?: string
  request?: RequestLogData
  response?: Partial<ResponseLogData>
  timestamp: Date
}

/**
 * Abstract logger interface
 */
export interface ILogger {
  /**
   * Log a request
   */
  logRequest(config: AxiosRequestConfig, context?: LogContext): void

  /**
   * Log a response
   */
  logResponse(response: AxiosResponse, duration: number, context?: LogContext): void

  /**
   * Log an error
   */
  logError(error: AxiosError, context?: LogContext): void

  /**
   * Log a message at a specific level
   */
  log(level: LogLevel, message: string, data?: unknown, context?: LogContext): void

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, unknown>,
    context?: LogContext
  ): void
}

/**
 * Base logger implementation with common utilities
 */
export abstract class BaseLogger implements ILogger {
  abstract logRequest(config: AxiosRequestConfig, context?: LogContext): void
  abstract logResponse(response: AxiosResponse, duration: number, context?: LogContext): void
  abstract logError(error: AxiosError, context?: LogContext): void
  abstract log(level: LogLevel, message: string, data?: unknown, context?: LogContext): void
  abstract logPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, unknown>,
    context?: LogContext
  ): void

  /**
   * Extract request data for logging (with sanitization)
   */
  protected extractRequestData(config: AxiosRequestConfig): RequestLogData {
    return {
      method: config.method?.toUpperCase() || 'GET',
      url: this.sanitizeUrl(config.url || ''),
      headers: this.sanitizeHeaders(config.headers),
      data: this.sanitizeData(config.data),
      params: config.params,
      timestamp: new Date(),
    }
  }

  /**
   * Extract response data for logging (with sanitization)
   */
  protected extractResponseData(response: AxiosResponse, duration: number): ResponseLogData {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: this.sanitizeHeaders(response.headers),
      data: this.sanitizeData(response.data),
      duration,
      timestamp: new Date(),
    }
  }

  /**
   * Extract error data for logging
   */
  protected extractErrorData(error: AxiosError): ErrorLogData {
    return {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      stack: error.stack,
      request: error.config ? this.extractRequestData(error.config) : undefined,
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: this.sanitizeData(error.response.data),
          }
        : undefined,
      timestamp: new Date(),
    }
  }

  /**
   * Sanitize URL to remove sensitive query parameters
   */
  protected sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url, 'http://placeholder.com')
      const sensitiveParams = ['token', 'key', 'secret', 'password', 'apiKey', 'api_key']

      sensitiveParams.forEach((param) => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '***REDACTED***')
        }
      })

      return urlObj.pathname + urlObj.search
    } catch {
      return url
    }
  }

  /**
   * Sanitize headers to remove sensitive information
   */
  protected sanitizeHeaders(
    headers?: Record<string, unknown>
  ): Record<string, string> | undefined {
    if (!headers) return undefined

    const sanitized: Record<string, string> = {}
    const sensitiveHeaders = [
      'authorization',
      'x-api-key',
      'x-auth-token',
      'cookie',
      'set-cookie',
    ]

    Object.entries(headers).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase()
      if (sensitiveHeaders.includes(lowerKey)) {
        sanitized[key] = '***REDACTED***'
      } else {
        sanitized[key] = String(value)
      }
    })

    return sanitized
  }

  /**
   * Sanitize data to remove sensitive fields
   */
  protected sanitizeData(data: unknown): unknown {
    if (!data) return undefined

    // Don't sanitize primitives
    if (typeof data !== 'object') return data

    // Clone to avoid mutating original
    const cloned = JSON.parse(JSON.stringify(data))

    // Recursively sanitize
    this.sanitizeObject(cloned)

    return cloned
  }

  /**
   * Recursively sanitize object fields
   */
  private sanitizeObject(obj: Record<string, unknown>): void {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'api_key',
      'accessToken',
      'refreshToken',
      'creditCard',
      'ssn',
    ]

    Object.keys(obj).forEach((key) => {
      const lowerKey = key.toLowerCase()

      // Check if field is sensitive
      if (sensitiveFields.some((field) => lowerKey.includes(field.toLowerCase()))) {
        obj[key] = '***REDACTED***'
        return
      }

      // Recursively sanitize nested objects
      if (obj[key] && typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key] as Record<string, unknown>)
      }
    })
  }

  /**
   * Format duration for display
   */
  protected formatDuration(duration: number): string {
    if (duration < 1000) {
      return `${duration}ms`
    }
    return `${(duration / 1000).toFixed(2)}s`
  }

  /**
   * Get log color based on status code
   */
  protected getStatusColor(status: number): string {
    if (status >= 500) return '🔴'
    if (status >= 400) return '🟠'
    if (status >= 300) return '🟡'
    if (status >= 200) return '🟢'
    return '⚪'
  }
}
