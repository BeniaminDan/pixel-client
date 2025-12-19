/**
 * @fileoverview Generic API hook for making requests with loading states
 */

'use client'

import { useState, useCallback } from 'react'
import { handleApiError, type ApiError } from '@/lib/api/errors'

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export interface UseApiOptions {
  /** Show toast notifications for errors */
  showErrorToast?: boolean
  /** Custom error handler */
  onError?: (error: ApiError) => void
  /** Custom success handler */
  onSuccess?: <T>(data: T) => void
}

/**
 * Generic API hook for making requests
 */
export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const { showErrorToast = true, onError, onSuccess } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (apiFn: () => Promise<T>): Promise<T | null> => {
      setState({ data: null, loading: true, error: null })

      try {
        const data = await apiFn()
        setState({ data, loading: false, error: null })

        if (onSuccess) {
          onSuccess(data)
        }

        return data
      } catch (error) {
        const apiError = handleApiError(error, {
          showToast: showErrorToast,
          logError: true,
          rethrow: false,
        })

        setState({ data: null, loading: false, error: apiError })

        if (onError) {
          onError(apiError)
        }

        return null
      }
    },
    [showErrorToast, onError, onSuccess]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
