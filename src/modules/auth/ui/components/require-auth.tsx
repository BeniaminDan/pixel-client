/**
 * @fileoverview Component to require authentication
 */

'use client'

import type { ReactNode } from 'react'
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export interface RequireAuthProps {
  /** Redirect URL when not authenticated */
  redirectTo?: string
  /** Content to show when not authenticated (instead of redirecting) */
  fallback?: ReactNode
  /** Children to render when authenticated */
  children: ReactNode
}

/**
 * Require authentication to render children
 */
export function RequireAuth({ redirectTo = '/login', fallback, children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !fallback) {
      const currentPath = window.location.pathname
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`)
    }
  }, [isAuthenticated, isLoading, redirectTo, fallback, router])

  // Show nothing while loading
  if (isLoading) {
    return null
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null
  }

  return <>{children}</>
}
