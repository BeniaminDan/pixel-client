"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export interface UseRequireAuthOptions {
  /** URL to redirect to if not authenticated */
  redirectTo?: string
  /** Whether to include the current path as callbackUrl */
  includeCallbackUrl?: boolean
  /** Callback when session is loading */
  onLoading?: () => void
  /** Callback when user is unauthenticated */
  onUnauthenticated?: () => void
  /** Callback when user is authenticated */
  onAuthenticated?: () => void
}

export interface UseRequireAuthReturn {
  /** Current user session data */
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  /** Whether the session is currently loading */
  isLoading: boolean
  /** Whether the user is authenticated */
  isAuthenticated: boolean
  /** Session error (e.g., RefreshTokenError) */
  error?: string
}

/**
 * Hook to require authentication on a page/component
 * Automatically redirects to login if not authenticated
 *
 * @example
 * ```tsx
 * function DashboardPage() {
 *   const { user, isLoading, isAuthenticated } = useRequireAuth()
 *
 *   if (isLoading) {
 *     return <LoadingSpinner />
 *   }
 *
 *   return <div>Welcome, {user?.name}</div>
 * }
 * ```
 */
export function useRequireAuth(
  options: UseRequireAuthOptions = {}
): UseRequireAuthReturn {
  const {
    redirectTo = "/login",
    includeCallbackUrl = true,
    onLoading,
    onUnauthenticated,
    onAuthenticated,
  } = options

  const router = useRouter()
  const { data: session, status } = useSession()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user || null
  const error = session?.error

  useEffect(() => {
    if (isLoading) {
      onLoading?.()
      return
    }

    if (!isAuthenticated) {
      onUnauthenticated?.()

      // Build redirect URL
      let redirectUrl = redirectTo
      if (includeCallbackUrl && typeof window !== "undefined") {
        const callbackUrl = encodeURIComponent(window.location.pathname)
        redirectUrl = `${redirectTo}?callbackUrl=${callbackUrl}`
      }

      router.push(redirectUrl)
      return
    }

    // Handle session errors (e.g., token refresh failed)
    if (error === "RefreshTokenError") {
      const redirectUrl = `${redirectTo}?error=SessionExpired`
      router.push(redirectUrl)
      return
    }

    onAuthenticated?.()
  }, [
    isLoading,
    isAuthenticated,
    error,
    redirectTo,
    includeCallbackUrl,
    router,
    onLoading,
    onUnauthenticated,
    onAuthenticated,
  ])

  return {
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      : null,
    isLoading,
    isAuthenticated,
    error,
  }
}

/**
 * Hook to get the current auth state without requiring authentication
 * Does not redirect - useful for optional auth components
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { user, isAuthenticated } = useAuth()
 *
 *   return (
 *     <header>
 *       {isAuthenticated ? <UserMenu user={user} /> : <LoginButton />}
 *     </header>
 *   )
 * }
 * ```
 */
export function useAuth(): UseRequireAuthReturn {
  const { data: session, status } = useSession()

  return {
    user: session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }
      : null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    error: session?.error,
  }
}
