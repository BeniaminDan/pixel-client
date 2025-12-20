/**
 * @fileoverview Console logger for development
 */

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { BaseLogger, LogLevel, type LogContext } from "@/server/http/application";

/**
 * Console logger for development environment
 */
export class ConsoleLogger extends BaseLogger {
  private enabled: boolean

  constructor(enabled = process.env.NODE_ENV === 'development') {
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
   * Log a request
   */
  logRequest(config: AxiosRequestConfig, context?: LogContext): void {
    if (!this.enabled) return

    const data = this.extractRequestData(config)

    console.group(`🚀 ${data.method} ${data.url}`)
    console.log('Request:', {
      method: data.method,
      url: data.url,
      params: data.params,
      data: data.data,
      headers: data.headers,
      timestamp: data.timestamp.toISOString(),
      context,
    })
    console.groupEnd()
  }

  /**
   * Log a response
   */
  logResponse(response: AxiosResponse, duration: number, context?: LogContext): void {
    if (!this.enabled) return

    const data = this.extractResponseData(response, duration)
    const statusIcon = this.getStatusColor(data.status)

    console.group(`${statusIcon} ${data.status} ${response.config.method?.toUpperCase()} ${response.config.url} (${this.formatDuration(duration)})`)
    console.log('Response:', {
      status: data.status,
      statusText: data.statusText,
      duration: this.formatDuration(duration),
      data: data.data,
      headers: data.headers,
      timestamp: data.timestamp.toISOString(),
      context,
    })
    console.groupEnd()
  }

  /**
   * Log an error
   */
  logError(error: AxiosError, context?: LogContext): void {
    if (!this.enabled) return

    const data = this.extractErrorData(error)

    console.group(`❌ API Error: ${data.message}`)
    console.error('Error Details:', {
      message: data.message,
      code: data.code,
      status: data.status,
      request: data.request,
      response: data.response,
      stack: data.stack,
      timestamp: data.timestamp.toISOString(),
      context,
    })
    console.groupEnd()
  }

  /**
   * Log a message at a specific level
   */
  log(level: LogLevel, message: string, data?: unknown, context?: LogContext): void {
    if (!this.enabled) return

    const logData = {
      message,
      data,
      context,
      timestamp: new Date().toISOString(),
    }

    switch (level) {
      case LogLevel.DEBUG:
        console.debug('🔍', logData)
        break
      case LogLevel.INFO:
        console.info('ℹ️', logData)
        break
      case LogLevel.WARN:
        console.warn('⚠️', logData)
        break
      case LogLevel.ERROR:
        console.error('❌', logData)
        break
    }
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

    const performanceIcon = duration > 3000 ? '🐌' : duration > 1000 ? '⏱️' : '⚡'

    console.log(`${performanceIcon} Performance: ${operation} - ${this.formatDuration(duration)}`, {
      operation,
      duration: this.formatDuration(duration),
      metadata,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Default console logger instance
 */
export const consoleLogger = new ConsoleLogger()
