/**
 * @fileoverview Utility functions for popup-based OAuth authentication.
 * This enables a better UX by keeping users on the current page during sign-in.
 */

export interface PopupOptions {
  width?: number
  height?: number
}

export interface AuthPopupResult {
  success: boolean
  error?: string
  callbackUrl?: string
}

const DEFAULT_POPUP_WIDTH = 500
const DEFAULT_POPUP_HEIGHT = 600

/**
 * Calculate centered popup window position
 */
function getPopupPosition(width: number, height: number) {
  const left = Math.round((window.innerWidth - width) / 2 + window.screenX)
  const top = Math.round((window.innerHeight - height) / 2 + window.screenY)
  return { left, top }
}

/**
 * Open an OAuth authentication popup window
 */
export function openAuthPopup(
  provider: string,
  callbackUrl: string = window.location.href,
  options: PopupOptions = {}
): Window | null {
  const { width = DEFAULT_POPUP_WIDTH, height = DEFAULT_POPUP_HEIGHT } = options
  const { left, top } = getPopupPosition(width, height)

  // Build the sign-in URL using a helper page that triggers Auth.js signIn
  // This is necessary because Auth.js v5 doesn't support /api/auth/signin/[providers] URLs
  const popupCallbackUrl = `/api/auth/popup-callback?returnTo=${encodeURIComponent(callbackUrl)}`
  
  // Create a URL to a page that will call signIn() with the providers
  const signInUrl = new URL("/login", window.location.origin)
  signInUrl.searchParams.set("provider", provider)
  signInUrl.searchParams.set("callbackUrl", popupCallbackUrl)
  signInUrl.searchParams.set("popup", "true")

  const popup = window.open(
    signInUrl.toString(),
    "auth-popup",
    `width=${width},height=${height},top=${top},left=${left},popup=1,toolbar=0,menubar=0,location=0,status=0`
  )

  if (popup) {
    popup.focus()
  }

  return popup
}

/**
 * Listen for authentication completion message from popup
 * Returns a promise that resolves when auth is complete
 */
export function listenForAuthComplete(
  popup: Window | null,
  timeoutMs: number = 300000 // 5 minutes default timeout
): Promise<AuthPopupResult> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error("Authentication timed out"))
    }, timeoutMs)

    // Check if popup was closed without completing auth
    const pollInterval = setInterval(() => {
      if (popup && popup.closed) {
        cleanup()
        resolve({ success: false, error: "Popup was closed" })
      }
    }, 500)

    function cleanup() {
      clearTimeout(timeoutId)
      clearInterval(pollInterval)
      window.removeEventListener("message", handleMessage)
    }

    function handleMessage(event: MessageEvent) {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return
      }

      const data = event.data as AuthPopupResult & { type?: string }

      if (data.type === "auth-popup-complete") {
        cleanup()
        if (popup && !popup.closed) {
          popup.close()
        }
        resolve({
          success: data.success,
          error: data.error,
          callbackUrl: data.callbackUrl,
        })
      }
    }

    window.addEventListener("message", handleMessage)
  })
}

/**
 * Combined function to open popup and wait for result
 */
export async function signInWithPopup(
  provider: string,
  callbackUrl?: string,
  options?: PopupOptions
): Promise<AuthPopupResult> {
  const popup = openAuthPopup(provider, callbackUrl, options)

  if (!popup) {
    return {
      success: false,
      error: "Failed to open popup. Please check your popup blocker settings.",
    }
  }

  try {
    return await listenForAuthComplete(popup)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    }
  }
}
