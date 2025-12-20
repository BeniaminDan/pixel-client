/**
 * @fileoverview React hook for permission checking
 */

'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasMinimumRole,
  isAdmin,
  isModerator,
  isAuthenticated,
  isGuest,
  getUserPermissions
} from "@/shared/permission-checker";
import {Permission, PermissionUser, Role } from "@/shared/types/permissions";

/**
 * Convert session to permission user
 */
function sessionToPermissionUser(session: unknown): PermissionUser | null {
  if (!session || typeof session !== 'object') return null

  const user = (session as { user?: unknown }).user
  if (!user || typeof user !== 'object') return null

  const typedUser = user as {
    id?: string
    role?: string
    permissions?: string[]
  }

  return {
    id: typedUser.id || '',
    role: (typedUser.role as Role) || Role.GUEST,
    permissions: typedUser.permissions as Permission[] | undefined,
  }
}

/**
 * Permission checking hook
 */
export function usePermissions() {
  const { data: session, status } = useSession()

  const user = useMemo(() => {
    return sessionToPermissionUser(session)
  }, [session])

  const permissions = useMemo(() => {
    return user ? getUserPermissions(user) : []
  }, [user])

  return {
    /** Current user with permissions */
    user,

    /** Loading state */
    isLoading: status === 'loading',

    /** All permissions for current user */
    permissions,

    /** Check if user has a specific permission */
    can: (permission: Permission) => hasPermission(user, permission),

    /** Check if user has any of the specified permissions */
    canAny: (perms: Permission[]) => hasAnyPermission(user, perms),

    /** Check if user has all of the specified permissions */
    canAll: (perms: Permission[]) => hasAllPermissions(user, perms),

    /** Check if user has a specific role */
    is: (role: Role) => hasRole(user, role),

    /** Check if user has any of the specified roles */
    isAny: (roles: Role[]) => hasAnyRole(user, roles),

    /** Check if user is at least a certain role level */
    isAtLeast: (minimumRole: Role) => hasMinimumRole(user, minimumRole),

    /** Check if user is admin */
    isAdmin: isAdmin(user),

    /** Check if user is moderator or admin */
    isModerator: isModerator(user),

    /** Check if user is authenticated */
    isAuthenticated: isAuthenticated(user),

    /** Check if user is guest */
    isGuest: isGuest(user),
  }
}

/**
 * Hook to check a specific permission
 */
export function useHasPermission(permission: Permission): boolean {
  const { can } = usePermissions()
  return can(permission)
}

/**
 * Hook to check a specific role
 */
export function useHasRole(role: Role): boolean {
  const { is } = usePermissions()
  return is(role)
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = usePermissions()
  return isAuthenticated
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const { isAdmin } = usePermissions()
  return isAdmin
}
