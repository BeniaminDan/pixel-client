/**
 * @fileoverview Component to conditionally render children based on user role
 */

'use client'

import type { ReactNode } from 'react'
import { Role } from "@/shared/types/permissions";
import { usePermissions } from "@/shared/hooks/usePermissions";

export interface RequireRoleProps {
  /** Required role(s) */
  role: Role | Role[]
  /** Use minimum role check (user must be at least this role level) */
  minimum?: boolean
  /** Content to show when role requirement is not met */
  fallback?: ReactNode
  /** Children to render when role requirement is met */
  children: ReactNode
}

/**
 * Conditionally render children based on user role
 */
export function RequireRole({ role, minimum = false, fallback = null, children }: RequireRoleProps) {
  const { is, isAny, isAtLeast, isLoading } = usePermissions()

  // Don't render anything while loading
  if (isLoading) {
    return null
  }

  // Check role
  let hasAccess = false

  if (Array.isArray(role)) {
    hasAccess = isAny(role)
  } else if (minimum) {
    hasAccess = isAtLeast(role)
  } else {
    hasAccess = is(role)
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
