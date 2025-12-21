import type {AxiosInstance} from "axios";
import {
  ApiConfig,
  attachLoggingInterceptor,
  attachRetryInterceptor,
  consoleLogger,
  DEFAULT_API_CONFIG,
  sentryLogger
} from "@/server";


/**
 * Attach interceptors to an Axios instance based on configuration
 */
export default function attachInterceptors(instance: AxiosInstance, config: Partial<ApiConfig>): void {
  const finalConfig = {
    ...DEFAULT_API_CONFIG,
    ...config,
  }

  // Attach logging interceptors
  if (finalConfig.logging.enabled) {
    const loggers = []
    if (finalConfig.logging.console) {
      loggers.push(consoleLogger)
    }
    if (finalConfig.logging.sentry) {
      loggers.push(sentryLogger)
    }
    attachLoggingInterceptor(instance, loggers)
  }

  // Attach retry interceptor
  if (finalConfig.retry.maxAttempts > 0) {
    attachRetryInterceptor(instance, finalConfig.retry)
  }
}