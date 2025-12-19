/**
 * @fileoverview Sentry logger for production error tracking
 */

import * as Sentry from '@sentry/nextjs'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { BaseLogger, LogLevel, type LogContext } from './Logger'
import { mapAxiosError } from '../errors'

/**
 * Sentry logger for production environment
 */
export class SentryLogger extends BaseLogger {
  private enabled: boolean

  constructor(enabled = process.env.NODE_ENV === 'production') {
    super()
    this.enabled = enabled
  }

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Log a request (as breadcrumb)
   */
  logRequest(config: AxiosRequestConfig, context?: LogContext): void {
    if (!this.enabled) return

    const data = this.extractRequestData(config)

    Sentry.addBreadcrumb({
      category: 'api.request',
      message: `${data.method} ${data.url}`,
      level: 'info',
      data: {
        method: data.method,
        url: data.url,
        params: data.params,
        requestId: context?.requestId,
        userId: context?.userId,
      },
    })
  }

  /**
   * Log a response (as breadcrumb)
   */
  logResponse(response: AxiosResponse, duration: number, context?: LogContext): void {
    if (!this.enabled) return

    const data = this.extractResponseData(response, duration)

    Sentry.addBreadcrumb({
      category: 'api.response',
      message: `${data.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      level: data.status >= 400 ? 'error' : 'info',
      data: {
        status: data.status,
        statusText: data.statusText,
        duration,
        url: response.config.url,
        method: response.config.method,
        requestId: context?.requestId,
        userId: context?.userId,
      },
    })
  }

  /**
   * Log an error (capture exception)
   */
  logError(error: AxiosError, context?: LogContext): void {
    if (!this.enabled) return

    const data = this.extractErrorData(error)
    const apiError = mapAxiosError(error as AxiosError<{ message?: string; error?: string; code?: string; status?: number; errors?: Record<string, string[]> }>)

    // Set error context
    Sentry.setContext('api_error', {
      code: data.code,
      status: data.status,
      url: data.request?.url,
      method: data.request?.method,
      message: data.message,
    })

    // Set user context if available
    if (context?.userId) {
      Sentry.setUser({ id: context.userId })
    }

    // Set custom tags
    Sentry.setTags({
      api_error_code: apiError.code,
      api_error_category: apiError.category,
      api_error_severity: apiError.severity,
      api_status_code: data.status?.toString() || 'unknown',
      api_retryable: apiError.retryable.toString(),
    })

    // Capture exception
    Sentry.captureException(apiError, {
      level: this.mapSeverityToSentryLevel(apiError.severity),
      fingerprint: [
        'api-error',
        apiError.code,
        data.request?.method || 'unknown',
        data.request?.url || 'unknown',
      ],
      contexts: {
        request: {
          method: data.request?.method,
          url: data.request?.url,
          params: data.request?.params,
        },
        response: data.response
          ? {
              status: data.response.status,
              statusText: data.response.statusText,
            }
          : undefined,
      },
    })
  }

  /**
   * Log a message at a specific level
   */
  log(level: LogLevel, message: string, data?: unknown, context?: LogContext): void {
    if (!this.enabled) return

    Sentry.addBreadcrumb({
      category: 'api.log',
      message,
      level: this.mapLogLevelToSentryLevel(level),
      data: {
        data,
        requestId: context?.requestId,
        userId: context?.userId,
      },
    })
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, unknown>,
    context?: LogContext
  ): void {
    if (!this.enabled) return

    // Add as breadcrumb
    Sentry.addBreadcrumb({
      category: 'api.performance',
      message: `${operation} took ${duration}ms`,
      level: duration > 3000 ? 'warning' : 'info',
      data: {
        operation,
        duration,
        metadata,
        requestId: context?.requestId,
      },
    })
  }

  /**
   * Map log level to Sentry breadcrumb level
   */
  private mapLogLevelToSentryLevel(
    level: LogLevel
  ): 'debug' | 'info' | 'warning' | 'error' | 'fatal' {
    switch (level) {
      case LogLevel.DEBUG:
        return 'debug'
      case LogLevel.INFO:
        return 'info'
      case LogLevel.WARN:
        return 'warning'
      case LogLevel.ERROR:
        return 'error'
      default:
        return 'info'
    }
  }

  /**
   * Map error severity to Sentry level
   */
  private mapSeverityToSentryLevel(
    severity: string
  ): 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' {
    switch (severity) {
      case 'critical':
        return 'fatal'
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'error'
    }
  }
}

/**
 * Default Sentry logger instance
 */
export const sentryLogger = new SentryLogger()
