/**
 * @fileoverview Hook for GET requests with caching and auto-refetch
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { handleApiError, type ApiError } from '@/lib/api/errors'

export interface UseApiQueryOptions<T> {
  /** Enable the query (default: true) */
  enabled?: boolean
  /** Refetch interval in milliseconds (0 = disabled) */
  refetchInterval?: number
  /** Retry on error */
  retry?: boolean
  /** Maximum retry attempts */
  maxRetries?: number
  /** Cache duration in milliseconds (0 = no cache) */
  cacheDuration?: number
  /** Show toast notifications for errors */
  showErrorToast?: boolean
  /** Custom error handler */
  onError?: (error: ApiError) => void
  /** Custom success handler */
  onSuccess?: (data: T) => void
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

// Global cache for API queries
const queryCache = new Map<string, CacheEntry<unknown>>()

/**
 * Hook for GET requests with caching and auto-refetch
 */
export function useApiQuery<T = unknown>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: UseApiQueryOptions<T> = {}
) {
  const {
    enabled = true,
    refetchInterval = 0,
    retry = false,
    maxRetries = 3,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    showErrorToast = false, // Don't show toast for query errors by default
    onError,
    onSuccess,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    // Check cache first
    if (cacheDuration > 0) {
      const cached = queryCache.get(queryKey) as CacheEntry<T> | undefined
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        setData(cached.data)
        setLoading(false)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await queryFn()

      if (!isMountedRef.current) return

      setData(result)
      setLoading(false)
      setError(null)
      retryCountRef.current = 0

      // Update cache
      if (cacheDuration > 0) {
        queryCache.set(queryKey, {
          data: result,
          timestamp: Date.now(),
        })
      }

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      if (!isMountedRef.current) return

      const apiError = handleApiError(err, {
        showToast: showErrorToast,
        logError: true,
        rethrow: false,
      })

      setError(apiError)
      setLoading(false)

      if (onError) {
        onError(apiError)
      }

      // Retry if enabled
      if (retry && apiError.retryable && retryCountRef.current < maxRetries) {
        retryCountRef.current++
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchData()
          }
        }, 1000 * retryCountRef.current) // Exponential backoff
      }
    }
  }, [
    enabled,
    queryKey,
    queryFn,
    cacheDuration,
    retry,
    maxRetries,
    showErrorToast,
    onError,
    onSuccess,
  ])

  const refetch = useCallback(() => {
    // Clear cache for this query
    queryCache.delete(queryKey)
    retryCountRef.current = 0
    return fetchData()
  }, [queryKey, fetchData])

  // Initial fetch and refetch interval
  useEffect(() => {
    isMountedRef.current = true
    fetchData()

    // Set up refetch interval if enabled
    if (refetchInterval > 0) {
      intervalRef.current = setInterval(fetchData, refetchInterval)
    }

    return () => {
      isMountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, refetchInterval])

  return {
    data,
    loading,
    error,
    refetch,
    isError: error !== null,
    isSuccess: data !== null && error === null,
  }
}

/**
 * Clear all cached queries
 */
export function clearQueryCache(): void {
  queryCache.clear()
}

/**
 * Clear specific query from cache
 */
export function clearQuery(queryKey: string): void {
  queryCache.delete(queryKey)
}
