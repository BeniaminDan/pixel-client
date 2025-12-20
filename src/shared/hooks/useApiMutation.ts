/**
 * @fileoverview Hook for POST/PUT/PATCH/DELETE requests (mutations)
 */

'use client'

import { useState, useCallback } from 'react'
import { handleApiError, type ApiError } from '@/lib/api/errors'
import { toast } from 'sonner'

export interface UseApiMutationOptions<TData, TVariables> {
  /** Show toast notifications for errors */
  showErrorToast?: boolean
  /** Show toast notifications for success */
  showSuccessToast?: boolean
  /** Success toast message */
  successMessage?: string | ((data: TData, variables: TVariables) => string)
  /** Custom error handler */
  onError?: (error: ApiError, variables: TVariables) => void
  /** Custom success handler */
  onSuccess?: (data: TData, variables: TVariables) => void
  /** Called when mutation is started */
  onMutate?: (variables: TVariables) => void
  /** Called when mutation is settled (success or error) */
  onSettled?: (data: TData | null, error: ApiError | null, variables: TVariables) => void
}

export interface UseApiMutationState<TData> {
  data: TData | null
  loading: boolean
  error: ApiError | null
}

/**
 * Hook for mutations (POST/PUT/PATCH/DELETE)
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions<TData, TVariables> = {}
) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    onError,
    onSuccess,
    onMutate,
    onSettled,
  } = options

  const [state, setState] = useState<UseApiMutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setState({ data: null, loading: true, error: null })

      if (onMutate) {
        onMutate(variables)
      }

      try {
        const data = await mutationFn(variables)
        setState({ data, loading: false, error: null })

        if (onSuccess) {
          onSuccess(data, variables)
        }

        if (showSuccessToast) {
          const message =
            typeof successMessage === 'function'
              ? successMessage(data, variables)
              : successMessage || 'Operation completed successfully'
          toast.success(message)
        }

        if (onSettled) {
          onSettled(data, null, variables)
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
          onError(apiError, variables)
        }

        if (onSettled) {
          onSettled(null, apiError, variables)
        }

        return null
      }
    },
    [
      mutationFn,
      showErrorToast,
      showSuccessToast,
      successMessage,
      onError,
      onSuccess,
      onMutate,
      onSettled,
    ]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    mutate,
    reset,
    isLoading: state.loading,
    isError: state.error !== null,
    isSuccess: state.data !== null && state.error === null,
  }
}
