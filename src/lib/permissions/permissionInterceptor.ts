/**
 * @fileoverview Axios interceptor for API-level permission checking
 */

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Permission, type PermissionUser } from './permissions.types'
import { hasPermission, checkPermission } from './permissionChecker'
import { InsufficientPermissionsError } from '../api/errors'

/**
 * API endpoint to permission mapping
 */
export interface EndpointPermissionConfig {
  /** HTTP method (GET, POST, etc.) or * for all */
  method: string
  /** URL pattern (supports wildcards) */
  pattern: string
  /** Required permission */
  permission: Permission
}

/**
 * Default endpoint permissions
 */
export const DEFAULT_ENDPOINT_PERMISSIONS: EndpointPermissionConfig[] = [
  // Pixel endpoints
  { method: 'GET', pattern: '/pixels*', permission: Permission.PIXEL_VIEW },
  { method: 'POST', pattern: '/pixels', permission: Permission.PIXEL_PLACE },
  { method: 'POST', pattern: '/pixels/bulk', permission: Permission.PIXEL_BULK_PLACE },

  // Throne endpoints
  { method: 'GET', pattern: '/throne*', permission: Permission.THRONE_VIEW },
  { method: 'POST', pattern: '/throne/bid', permission: Permission.THRONE_BID },
  { method: '*', pattern: '/throne/manage*', permission: Permission.THRONE_MANAGE },

  // Admin endpoints
  { method: '*', pattern: '/admin/*', permission: Permission.CANVAS_ADMIN },
  { method: '*', pattern: '/users/manage*', permission: Permission.USER_MANAGE },
  { method: 'POST', pattern: '/users/*/ban', permission: Permission.USER_BAN },
  { method: '*', pattern: '/moderation/*', permission: Permission.CONTENT_MODERATE },
  { method: 'GET', pattern: '/analytics*', permission: Permission.ANALYTICS_VIEW },
  { method: '*', pattern: '/settings/manage*', permission: Permission.SETTINGS_MANAGE },

  // Payment endpoints
  { method: 'POST', pattern: '/payments', permission: Permission.PAYMENT_MAKE },
  { method: 'POST', pattern: '/payments/*/refund', permission: Permission.PAYMENT_REFUND },
  { method: 'GET', pattern: '/payments/history*', permission: Permission.PAYMENT_VIEW_HISTORY },
]

/**
 * Function to get current user
 */
export type UserGetter = () => Promise<PermissionUser | null> | PermissionUser | null

/**
 * Check if URL matches pattern
 */
function matchesPattern(url: string, pattern: string): boolean {
  if (pattern === url) return true
  if (pattern.endsWith('*')) {
    const basePattern = pattern.slice(0, -1)
    return url.startsWith(basePattern)
  }
  return false
}

/**
 * Get required permission for an endpoint
 */
export function getEndpointPermission(
  method: string,
  url: string,
  configs: EndpointPermissionConfig[] = DEFAULT_ENDPOINT_PERMISSIONS
): Permission | null {
  for (const config of configs) {
    // Check method match (case insensitive)
    const methodMatches =
      config.method === '*' || config.method.toUpperCase() === method.toUpperCase()

    // Check URL pattern match
    const urlMatches = matchesPattern(url, config.pattern)

    if (methodMatches && urlMatches) {
      return config.permission
    }
  }

  return null
}

/**
 * Attach permission interceptor to check permissions before making requests
 */
export function attachPermissionInterceptor(
  axiosInstance: AxiosInstance,
  getUser: UserGetter,
  configs: EndpointPermissionConfig[] = DEFAULT_ENDPOINT_PERMISSIONS
): void {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const method = config.method?.toUpperCase() || 'GET'
      const url = config.url || ''

      // Get required permission for this endpoint
      const requiredPermission = getEndpointPermission(method, url, configs)

      // No permission required, allow request
      if (!requiredPermission) {
        return config
      }

      // Get current user
      const user = await getUser()

      // Check permission
      const result = checkPermission(user, requiredPermission)

      if (!result.allowed) {
        throw new InsufficientPermissionsError(requiredPermission)
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
