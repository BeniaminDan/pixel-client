/**
 * @fileoverview Core permission checking logic
 */

import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  type PermissionUser,
  type PermissionCheckResult
} from "@/server/http/contracts";

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Get all permissions for a user (role + custom permissions)
 */
export function getUserPermissions(user: PermissionUser): Permission[] {
  const rolePermissions = getRolePermissions(user.role)
  const customPermissions = user.permissions || []

  // Combine and deduplicate
  return Array.from(new Set([...rolePermissions, ...customPermissions]))
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: PermissionUser | null | undefined, permission: Permission): boolean {
  if (!user) return false

  const userPermissions = getUserPermissions(user)
  return userPermissions.includes(permission)
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  user: PermissionUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false

  const userPermissions = getUserPermissions(user)
  return permissions.some((permission) => userPermissions.includes(permission))
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  user: PermissionUser | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user) return false

  const userPermissions = getUserPermissions(user)
  return permissions.every((permission) => userPermissions.includes(permission))
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: PermissionUser | null | undefined, role: Role): boolean {
  if (!user) return false
  return user.role === role
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(user: PermissionUser | null | undefined, roles: Role[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Check if a user is at least a certain role level
 */
export function hasMinimumRole(user: PermissionUser | null | undefined, minimumRole: Role): boolean {
  if (!user) return false

  const roleHierarchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.PREMIUM]: 2,
    [Role.MODERATOR]: 3,
    [Role.ADMIN]: 4,
  }

  return roleHierarchy[user.role] >= roleHierarchy[minimumRole]
}

/**
 * Detailed permission check with reason
 */
export function checkPermission(
  user: PermissionUser | null | undefined,
  permission: Permission
): PermissionCheckResult {
  if (!user) {
    return {
      allowed: false,
      reason: 'User is not authenticated',
    }
  }

  const allowed = hasPermission(user, permission)

  if (!allowed) {
    return {
      allowed: false,
      reason: `User does not have permission: ${permission}`,
    }
  }

  return {
    allowed: true,
  }
}

/**
 * Detailed role check with reason
 */
export function checkRole(
  user: PermissionUser | null | undefined,
  role: Role
): PermissionCheckResult {
  if (!user) {
    return {
      allowed: false,
      reason: 'User is not authenticated',
    }
  }

  const allowed = hasRole(user, role)

  if (!allowed) {
    return {
      allowed: false,
      reason: `User role is ${user.role}, but ${role} is required`,
    }
  }

  return {
    allowed: true,
  }
}

/**
 * Check if user is admin
 */
export function isAdmin(user: PermissionUser | null | undefined): boolean {
  return hasRole(user, Role.ADMIN)
}

/**
 * Check if user is moderator or admin
 */
export function isModerator(user: PermissionUser | null | undefined): boolean {
  return hasAnyRole(user, [Role.MODERATOR, Role.ADMIN])
}

/**
 * Check if user is authenticated (not guest)
 */
export function isAuthenticated(user: PermissionUser | null | undefined): boolean {
  if (!user) return false
  return user.role !== Role.GUEST
}

/**
 * Check if user is guest
 */
export function isGuest(user: PermissionUser | null | undefined): boolean {
  if (!user) return true
  return user.role === Role.GUEST
}
