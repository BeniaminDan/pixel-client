/**
 * @fileoverview Request interceptor for adding common headers and metadata
 */

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { applyIdempotencyConfig } from "@/shared/idempotency-manager"

/**
 * Add request metadata and headers
 */
export function attachRequestInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add timestamp header
      config.headers['X-Request-Time'] = new Date().toISOString()

      // Add idempotency keys for non-idempotent methods
      applyIdempotencyConfig(config)

      // Add client version header
      config.headers['X-Client-Version'] = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'

      // Add user agent if on server
      if (typeof window === 'undefined') {
        config.headers['User-Agent'] = 'PixelClient/Next.js'
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
