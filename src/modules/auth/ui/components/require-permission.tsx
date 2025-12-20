/**
 * @fileoverview Component to conditionally render children based on permissions
 */

'use client'

import type { ReactNode } from 'react'
import { Permission } from '@/lib/permissions'
import { usePermissions } from '@/hooks/api'

export interface RequirePermissionProps {
  /** Required permission(s) */
  permission: Permission | Permission[]
  /** Require all permissions (default: false, meaning any permission is sufficient) */
  requireAll?: boolean
  /** Content to show when permission is denied */
  fallback?: ReactNode
  /** Children to render when permission is granted */
  children: ReactNode
}

/**
 * Conditionally render children based on user permissions
 */
export function RequirePermission({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const { can, canAll, isLoading } = usePermissions()

  // Don't render anything while loading
  if (isLoading) {
    return null
  }

  // Check permissions
  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? canAll(permission)
      : permission.some((p) => can(p))
    : can(permission)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
