"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup, type AuthPopupResult} from "@/modules/auth";

export interface UseAuthPopupOptions {
  /** URL to redirect to after successful authentication */
  callbackUrl?: string
  /** Whether to automatically redirect on success */
  autoRedirect?: boolean
  /** Callback when authentication succeeds */
  onSuccess?: (result: AuthPopupResult) => void
  /** Callback when authentication fails */
  onError?: (error: string) => void
}

export interface UseAuthPopupReturn {
  /** Trigger the popup sign-in flow */
  signIn: (provider?: string) => Promise<void>
  /** Whether authentication is in progress */
  isLoading: boolean
  /** Error message if authentication failed */
  error: string | null
  /** Reset the error state */
  clearError: () => void
}

/**
 * Hook for handling popup-based OAuth authentication
 *
 * @example
 * ```tsx
 * const { signIn, isLoading, error } = useAuthPopup({
 *   callbackUrl: '/dashboard',
 *   onSuccess: () => console.log('Logged in!')
 * })
 *
 * return (
 *   <button onClick={() => signIn('openiddict')} disabled={isLoading}>
 *     {isLoading ? 'Signing in...' : 'Sign in'}
 *   </button>
 * )
 * ```
 */
export function useAuthPopup(options: UseAuthPopupOptions = {}): UseAuthPopupReturn {
  const {
    callbackUrl,
    autoRedirect = true,
    onSuccess,
    onError,
  } = options

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signIn = useCallback(
    async (provider: string = "openiddict") => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await signInWithPopup(
          provider,
          callbackUrl || window.location.href
        )

        if (result.success) {
          onSuccess?.(result)

          if (autoRedirect && result.callbackUrl) {
            // Use router.refresh to update session state, then navigate
            router.refresh()
            router.push(result.callbackUrl)
          } else {
            // Just refresh to update session state
            router.refresh()
          }
        } else {
          const errorMessage = result.error || "Authentication failed"
          setError(errorMessage)
          onError?.(errorMessage)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Authentication failed"
        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [callbackUrl, autoRedirect, onSuccess, onError, router]
  )

  return {
    signIn,
    isLoading,
    error,
    clearError,
  }
}
