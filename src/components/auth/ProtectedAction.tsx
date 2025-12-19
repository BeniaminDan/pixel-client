/**
 * @fileoverview Component to wrap actions (buttons, links) with permission checks
 */

'use client'

import type { ReactNode, MouseEvent } from 'react'
import { Permission, Role } from '@/lib/permissions'
import { usePermissions } from '@/hooks/api'
import { toast } from 'sonner'

export interface ProtectedActionProps {
  /** Required permission(s) */
  permission?: Permission | Permission[]
  /** Required role(s) */
  role?: Role | Role[]
  /** Require all permissions (default: false) */
  requireAll?: boolean
  /** Use minimum role check */
  minimumRole?: boolean
  /** Message to show when permission is denied */
  deniedMessage?: string
  /** Callback when action is allowed */
  onAction?: (event: MouseEvent) => void
  /** Disable the action instead of hiding it */
  disableWhenDenied?: boolean
  /** Children to render */
  children: ReactNode | ((hasAccess: boolean) => ReactNode)
}

/**
 * Wrap actions with permission checks
 * Can either hide or disable the action when permission is denied
 */
export function ProtectedAction({
  permission,
  role,
  requireAll = false,
  minimumRole = false,
  deniedMessage = 'You do not have permission to perform this action',
  onAction,
  disableWhenDenied = false,
  children,
}: ProtectedActionProps) {
  const { can, canAll, is, isAny, isAtLeast, isLoading } = usePermissions()

  // Check permissions
  let hasAccess = true

  if (permission) {
    hasAccess = Array.isArray(permission)
      ? requireAll
        ? canAll(permission)
        : permission.some((p) => can(p))
      : can(permission)
  }

  // Check role
  if (hasAccess && role) {
    if (Array.isArray(role)) {
      hasAccess = isAny(role)
    } else if (minimumRole) {
      hasAccess = isAtLeast(role)
    } else {
      hasAccess = is(role)
    }
  }

  const handleClick = (event: MouseEvent) => {
    if (!hasAccess) {
      event.preventDefault()
      event.stopPropagation()
      toast.warning(deniedMessage)
      return
    }

    if (onAction) {
      onAction(event)
    }
  }

  // Loading state
  if (isLoading) {
    return null
  }

  // If disabling instead of hiding
  if (disableWhenDenied) {
    const childElement = typeof children === 'function' ? children(hasAccess) : children
    return <div onClick={handleClick}>{childElement}</div>
  }

  // Hide when denied
  if (!hasAccess) {
    return null
  }

  const childElement = typeof children === 'function' ? children(hasAccess) : children

  // Add click handler if provided
  if (onAction) {
    return <div onClick={handleClick}>{childElement}</div>
  }

  return <>{childElement}</>
}
