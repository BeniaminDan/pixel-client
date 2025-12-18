/**
 * @fileoverview API client configuration for making HTTP requests.
 *
 * ## Authentication Strategy
 *
 * This application uses HTTP-only cookies for secure token storage.
 * Access tokens are never exposed to client-side JavaScript.
 *
 * ### For authenticated requests:
 * Use the Next.js API proxy route at `/api/backend/...` which automatically
 * attaches the Bearer token from the server-side session.
 *
 * @example
 * ```tsx
 * // Client-side authenticated request (goes through proxy)
 * const response = await fetch('/api/backend/account/me')
 * ```
 *
 * ### For public/unauthenticated requests:
 * Use the apiClient directly for public endpoints.
 *
 * @example
 * ```tsx
 * import { apiClient } from '@/lib/apiClient'
 * const response = await apiClient.get('/public/health')
 * ```
 *
 * ### For server-side requests:
 * Use the services in `@/services` which handle authentication automatically.
 *
 * @example
 * ```tsx
 * import { getProfile } from '@/services/account'
 * const result = await getProfile()
 * ```
 */

import axios from 'axios'

/**
 * API client for public (unauthenticated) requests.
 *
 * For authenticated requests, use the proxy at `/api/backend/...` instead.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Proxy client for authenticated requests through Next.js API routes.
 * This client automatically uses the session's access token via the proxy.
 */
export const authenticatedClient = axios.create({
  baseURL: '/api/backend',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
authenticatedClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized/session expired)
    if (error.response?.status === 401) {
      // Optionally redirect to login or trigger re-authentication
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}&error=SessionExpired`
      }
    }
    return Promise.reject(error)
  }
)
