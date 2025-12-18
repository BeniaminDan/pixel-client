"use server"

import { signIn, signOut, clearRefreshTokenCookie } from "@/auth"

/**
 * Sign in using OAuth provider (opens redirect flow)
 * Note: For popup-based OAuth, use the useAuthPopup hook instead
 */
export async function oauthLoginAction(redirectTo: string = "/") {
  await signIn("openiddict", { redirectTo })
}

/**
 * Legacy login action for backward compatibility
 * @deprecated Use oauthLoginAction or credentials login instead
 */
export async function loginAction() {
  await signIn("openiddict", { redirectTo: "/" })
}

/**
 * Sign out and redirect to specified URL
 */
export async function logoutAction(redirectTo: string = "/") {
  // Clear refresh token cookie before signing out
  await clearRefreshTokenCookie()
  await signOut({ redirectTo })
}
