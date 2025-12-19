/**
 * @fileoverview Axios interceptor for request/response logging
 */

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ILogger, LogContext } from './Logger'
import { consoleLogger } from './ConsoleLogger'
import { sentryLogger } from './SentryLogger'

// Symbol to track request start time
const REQUEST_START_TIME_SYMBOL = Symbol('requestStartTime')
const REQUEST_ID_SYMBOL = Symbol('requestId')

interface TimedAxiosRequestConfig extends InternalAxiosRequestConfig {
  [REQUEST_START_TIME_SYMBOL]?: number
  [REQUEST_ID_SYMBOL]?: string
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get log context from request config and session
 */
function getLogContext(config: TimedAxiosRequestConfig): LogContext {
  return {
    requestId: config[REQUEST_ID_SYMBOL],
    timestamp: new Date(),
  }
}

/**
 * Attach logging interceptor to an Axios instance
 */
export function attachLoggingInterceptor(
  axiosInstance: AxiosInstance,
  logger?: ILogger | ILogger[]
): void {
  const loggers = Array.isArray(logger)
    ? logger
    : logger
      ? [logger]
      : [consoleLogger, sentryLogger]

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const timedConfig = config as TimedAxiosRequestConfig

      // Add request ID
      timedConfig[REQUEST_ID_SYMBOL] = generateRequestId()

      // Track request start time
      timedConfig[REQUEST_START_TIME_SYMBOL] = Date.now()

      // Add request ID to headers for tracing
      timedConfig.headers = timedConfig.headers || {}
      timedConfig.headers['X-Request-ID'] = timedConfig[REQUEST_ID_SYMBOL]

      // Log request
      const context = getLogContext(timedConfig)
      loggers.forEach((l) => l.logRequest(config, context))

      return config
    },
    (error) => {
      // Log request error
      loggers.forEach((l) => l.logError(error))
      return Promise.reject(error)
    }
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as TimedAxiosRequestConfig
      const startTime = config[REQUEST_START_TIME_SYMBOL]
      const duration = startTime ? Date.now() - startTime : 0

      // Log response
      const context = getLogContext(config)
      loggers.forEach((l) => l.logResponse(response, duration, context))

      // Log performance if slow
      if (duration > 1000) {
        loggers.forEach((l) =>
          l.logPerformance(
            `${config.method?.toUpperCase()} ${config.url}`,
            duration,
            {
              status: response.status,
            },
            context
          )
        )
      }

      return response
    },
    (error) => {
      // Calculate duration even for errors
      const config = error.config as TimedAxiosRequestConfig | undefined
      if (config) {
        const startTime = config[REQUEST_START_TIME_SYMBOL]
        const duration = startTime ? Date.now() - startTime : 0
        const context = getLogContext(config)

        // Log error
        loggers.forEach((l) => l.logError(error, context))

        // Log performance for slow errors
        if (duration > 1000) {
          loggers.forEach((l) =>
            l.logPerformance(
              `${config.method?.toUpperCase()} ${config.url} (ERROR)`,
              duration,
              {
                error: error.message,
                status: error.response?.status,
              },
              context
            )
          )
        }
      } else {
        // No config, just log error
        loggers.forEach((l) => l.logError(error))
      }

      return Promise.reject(error)
    }
  )
}

/**
 * Get request ID from config
 */
export function getRequestId(config: TimedAxiosRequestConfig): string | undefined {
  return config[REQUEST_ID_SYMBOL]
}

/**
 * Get request start time from config
 */
export function getRequestStartTime(config: TimedAxiosRequestConfig): number | undefined {
  return config[REQUEST_START_TIME_SYMBOL]
}

/**
 * Get request duration from config
 */
export function getRequestDuration(config: TimedAxiosRequestConfig): number {
  const startTime = config[REQUEST_START_TIME_SYMBOL]
  return startTime ? Date.now() - startTime : 0
}
