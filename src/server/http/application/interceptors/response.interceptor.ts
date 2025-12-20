/**
 * @fileoverview Response interceptor for unwrapping and transforming responses
 */

import type { AxiosInstance, AxiosResponse } from 'axios'

interface ApiResponseEnvelope<T> {
  data: T
  message?: string
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    pageCount?: number
  }
}

/**
 * Check if response is an API envelope
 */
function isApiEnvelope<T>(data: unknown): data is ApiResponseEnvelope<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    (typeof (data as ApiResponseEnvelope<T>).data !== 'undefined')
  )
}

/**
 * Unwrap API response envelope
 */
function unwrapResponse<T>(response: AxiosResponse): AxiosResponse<T> {
  // If response data is wrapped in an envelope, unwrap it
  if (isApiEnvelope<T>(response.data)) {
    return {
      ...response,
      data: response.data.data,
    }
  }

  return response
}

/**
 * Attach response interceptor to unwrap API envelopes
 */
export function attachResponseInterceptor(
  axiosInstance: AxiosInstance,
  unwrap = true
): void {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Unwrap response if enabled
      if (unwrap) {
        return unwrapResponse(response)
      }

      return response
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
