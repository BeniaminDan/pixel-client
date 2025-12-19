/**
 * @fileoverview Next.js middleware for route-level permission checking
 */

import { NextResponse, type NextRequest } from 'next/server'
import type { Session } from 'next-auth'
import { Role, Permission, type PermissionUser } from './permissions.types'
import { hasPermission, hasRole, hasMinimumRole } from './permissionChecker'

/**
 * Route permission configuration
 */
export interface RoutePermissionConfig {
  /** Required role for the route */
  role?: Role
  /** Minimum role required for the route */
  minimumRole?: Role
  /** Required permissions for the route (any) */
  permissions?: Permission[]
  /** Required permissions for the route (all) */
  allPermissions?: Permission[]
  /** Redirect URL if permission denied */
  redirectTo?: string
}

/**
 * Map of route patterns to permission configs
 */
export type RoutePermissionMap = Record<string, RoutePermissionConfig>

/**
 * Default route permissions
 */
export const DEFAULT_ROUTE_PERMISSIONS: RoutePermissionMap = {
  // Admin routes
  '/admin': {
    role: Role.ADMIN,
    redirectTo: '/403',
  },
  '/admin/*': {
    role: Role.ADMIN,
    redirectTo: '/403',
  },

  // User routes
  '/settings': {
    minimumRole: Role.USER,
    redirectTo: '/login',
  },
  '/settings/*': {
    minimumRole: Role.USER,
    redirectTo: '/login',
  },
  '/users/profile': {
    minimumRole: Role.USER,
    redirectTo: '/login',
  },

  // Canvas routes
  '/canvas': {
    permissions: [Permission.PIXEL_VIEW],
    redirectTo: '/login',
  },

  // Throne routes
  '/throne': {
    permissions: [Permission.THRONE_VIEW],
    redirectTo: '/login',
  },
}

/**
 * Convert session to permission user
 */
function sessionToPermissionUser(session: Session | null): PermissionUser | null {
  if (!session?.user) return null

  return {
    id: session.user.id || '',
    role: (session.user.role as Role) || Role.GUEST,
    permissions: session.user.permissions as Permission[] | undefined,
  }
}

/**
 * Check if route matches pattern (supports wildcards)
 */
function matchesRoute(pathname: string, pattern: string): boolean {
  if (pattern === pathname) return true
  if (pattern.endsWith('/*')) {
    const basePattern = pattern.slice(0, -2)
    return pathname.startsWith(basePattern)
  }
  return false
}

/**
 * Get permission config for a route
 */
export function getRoutePermissionConfig(
  pathname: string,
  routeMap: RoutePermissionMap = DEFAULT_ROUTE_PERMISSIONS
): RoutePermissionConfig | null {
  // Find matching route pattern
  for (const [pattern, config] of Object.entries(routeMap)) {
    if (matchesRoute(pathname, pattern)) {
      return config
    }
  }
  return null
}

/**
 * Check if user has permission to access route
 */
export function checkRoutePermission(
  user: PermissionUser | null,
  config: RoutePermissionConfig
): boolean {
  // Check role
  if (config.role && !hasRole(user, config.role)) {
    return false
  }

  // Check minimum role
  if (config.minimumRole && !hasMinimumRole(user, config.minimumRole)) {
    return false
  }

  // Check permissions (any)
  if (config.permissions) {
    const hasAny = config.permissions.some((permission) => hasPermission(user, permission))
    if (!hasAny) return false
  }

  // Check permissions (all)
  if (config.allPermissions) {
    const hasAll = config.allPermissions.every((permission) => hasPermission(user, permission))
    if (!hasAll) return false
  }

  return true
}

/**
 * Create permission middleware
 */
export function createPermissionMiddleware(
  getSession: (request: NextRequest) => Promise<Session | null>,
  routeMap: RoutePermissionMap = DEFAULT_ROUTE_PERMISSIONS
) {
  return async function permissionMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get permission config for route
    const config = getRoutePermissionConfig(pathname, routeMap)

    // No permission config, allow access
    if (!config) {
      return NextResponse.next()
    }

    // Get user session
    const session = await getSession(request)
    const user = sessionToPermissionUser(session)

    // Check permission
    const allowed = checkRoutePermission(user, config)

    if (!allowed) {
      // Redirect to configured URL or default
      const redirectUrl = config.redirectTo || '/403'
      const url = request.nextUrl.clone()
      url.pathname = redirectUrl
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // Allow access
    return NextResponse.next()
  }
}
