/**
 * @fileoverview Auth interceptor for managing authentication tokens
 */

import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { UnauthorizedError, TokenExpiredError } from '../errors'

/**
 * Function to get access token (client-side or server-side)
 */
export type TokenGetter = () => Promise<string | null> | string | null

/**
 * Function to refresh access token
 */
export type TokenRefresher = () => Promise<string | null>

/**
 * Function to handle authentication failure
 */
export type AuthFailureHandler = (error: AxiosError) => void

export interface AuthInterceptorOptions {
  /** Function to get current access token */
  getToken: TokenGetter
  /** Function to refresh access token (optional) */
  refreshToken?: TokenRefresher
  /** Function to handle authentication failure (optional) */
  onAuthFailure?: AuthFailureHandler
  /** Whether to automatically refresh token on 401 */
  autoRefresh?: boolean
}

// Track if we're currently refreshing to avoid multiple concurrent refreshes
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * Subscribe to token refresh
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback)
}

/**
 * Notify all subscribers when token is refreshed
 */
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

/**
 * Attach authentication interceptor
 */
export function attachAuthInterceptor(
  axiosInstance: AxiosInstance,
  options: AuthInterceptorOptions
): void {
  const { getToken, refreshToken, onAuthFailure, autoRefresh = true } = options

  // Request interceptor - add auth token
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Get token
      const token = await getToken()

      // Add authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle auth errors
  axiosInstance.interceptors.response.use(
    // Success - pass through
    (response) => response,

    // Error - handle auth failures
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Not a 401 error, pass through
      if (error.response?.status !== 401) {
        return Promise.reject(error)
      }

      // Already tried to refresh, or no refresh function available
      if (originalRequest._retry || !refreshToken || !autoRefresh) {
        // Call auth failure handler
        if (onAuthFailure) {
          onAuthFailure(error)
        }

        // Throw appropriate error
        const errorData = error.response?.data as { message?: string } | undefined
        const errorMessage = errorData?.message || error.message
        if (errorMessage.toLowerCase().includes('expired')) {
          return Promise.reject(new TokenExpiredError(errorMessage, error))
        }
        return Promise.reject(new UnauthorizedError(errorMessage, error))
      }

      // Mark as retrying
      originalRequest._retry = true

      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(async (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      // Start refreshing
      isRefreshing = true

      try {
        // Refresh the token
        const newToken = await refreshToken()

        if (!newToken) {
          throw new Error('Failed to refresh token')
        }

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // Notify all subscribers
        onTokenRefreshed(newToken)

        // Retry the original request
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Call auth failure handler
        if (onAuthFailure) {
          onAuthFailure(error)
        }

        return Promise.reject(new TokenExpiredError('Failed to refresh token', refreshError))
      } finally {
        isRefreshing = false
      }
    }
  )
}

/**
 * Create token getter for client-side (using next-auth)
 */
export function createClientTokenGetter(): TokenGetter {
  return async () => {
    if (typeof window === 'undefined') return null

    try {
      // Dynamically import to avoid SSR issues
      const { getSession } = await import('next-auth/react')
      const session = await getSession()
      return session?.accessToken || null
    } catch {
      return null
    }
  }
}

/**
 * Create token getter for server-side (using next-auth)
 */
export function createServerTokenGetter(): TokenGetter {
  return async () => {
    if (typeof window !== 'undefined') return null

    try {
      // Dynamically import to avoid client-side issues
      const { auth } = await import('@/lib/auth')
      const session = await auth()
      
      // Get token from session JWT
      const { cookies } = await import('next/headers')
      const { decode } = await import('next-auth/jwt')
      
      const cookieStore = await cookies()
      const sessionToken =
        cookieStore.get('authjs.session-token')?.value ||
        cookieStore.get('__Secure-authjs.session-token')?.value

      if (!sessionToken) return null

      const decoded = await decode({
        token: sessionToken,
        secret: process.env.AUTH_SECRET!,
        salt:
          process.env.NODE_ENV === 'production'
            ? '__Secure-authjs.session-token'
            : 'authjs.session-token',
      })

      return (decoded?.accessToken as string) || null
    } catch {
      return null
    }
  }
}

/**
 * Create auth failure handler for client-side (redirect to login)
 */
export function createClientAuthFailureHandler(): AuthFailureHandler {
  return (error: AxiosError) => {
    if (typeof window === 'undefined') return

    const currentPath = window.location.pathname
    const errorData = error.response?.data as { message?: string } | undefined
    const errorMessage = errorData?.message || 'SessionExpired'
    window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}&error=${errorMessage}`
  }
}
