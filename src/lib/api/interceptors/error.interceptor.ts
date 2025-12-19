/**
 * @fileoverview Error interceptor for handling and transforming errors
 */

import type { AxiosInstance, AxiosError } from 'axios'
import { handleApiError } from '../errors'

export interface ErrorInterceptorOptions {
  /** Show toast notifications for errors */
  showToast?: boolean
  /** Log errors to console/sentry */
  logError?: boolean
  /** Custom error handler callback */
  onError?: (error: AxiosError) => void
}

/**
 * Attach error interceptor for global error handling
 */
export function attachErrorInterceptor(
  axiosInstance: AxiosInstance,
  options: ErrorInterceptorOptions = {}
): void {
  const { showToast = true, logError = true, onError } = options

  axiosInstance.interceptors.response.use(
    // Success - pass through
    (response) => response,

    // Error - handle and transform
    (error: AxiosError) => {
      // Call custom error handler if provided
      if (onError) {
        onError(error)
      }

      // Map to ApiError and handle
      const apiError = handleApiError(error, {
        showToast,
        logError,
        rethrow: false,
      })

      // Reject with the mapped ApiError
      return Promise.reject(apiError)
    }
  )
}
