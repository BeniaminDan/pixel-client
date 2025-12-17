/**
 * @fileoverview Account management service for interacting with the backend API.
 * All functions in this service are designed to be called from server actions.
 */

import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"

const API_BASE = process.env.API_BASE_URL

export interface UserProfile {
  id: string
  email: string
  name?: string
  emailConfirmed: boolean
  createdAt: string
  updatedAt?: string
}

export interface UpdateProfileData {
  name?: string
  // Add other updatable fields as needed
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ResetPasswordData {
  email: string
  token: string
  newPassword: string
  confirmNewPassword: string
}

export interface ServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

/**
 * Get the access token from the NextAuth JWT cookie
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken =
      cookieStore.get("authjs.session-token")?.value ||
      cookieStore.get("__Secure-authjs.session-token")?.value

    if (!sessionToken) {
      return null
    }

    const decoded = await decode({
      token: sessionToken,
      secret: process.env.AUTH_SECRET!,
      salt:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
    })

    return decoded?.accessToken as string | null
  } catch (error) {
    console.error("Error getting access token:", error)
    return null
  }
}

/**
 * Make an authenticated request to the API
 */
async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    throw new Error("Not authenticated")
  }

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })
}

/**
 * Make an unauthenticated request to the API
 */
async function publicFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<{
  error: string
  errors?: Record<string, string[]>
}> {
  try {
    const data = await response.json()
    return {
      error: data.message || data.error || "An error occurred",
      errors: data.errors,
    }
  } catch {
    return { error: "An error occurred" }
  }
}

// ============================================================================
// Public (unauthenticated) endpoints
// ============================================================================

/**
 * Confirm email address with token
 */
export async function confirmEmail(
  userId: string,
  token: string
): Promise<ServiceResult> {
  try {
    const response = await publicFetch(
      `/account/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
    )

    if (!response.ok) {
      const { error } = await parseErrorResponse(response)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Email confirmation error:", error)
    return { success: false, error: "Failed to confirm email" }
  }
}

/**
 * Resend email confirmation
 */
export async function resendConfirmation(email: string): Promise<ServiceResult> {
  try {
    const response = await publicFetch("/account/resend-confirmation", {
      method: "POST",
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const { error } = await parseErrorResponse(response)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Resend confirmation error:", error)
    return { success: false, error: "Failed to resend confirmation email" }
  }
}

/**
 * Request password reset email
 */
export async function forgotPassword(email: string): Promise<ServiceResult> {
  try {
    await publicFetch("/account/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })

    // Always return success to prevent email enumeration
    // The API should also follow this pattern
    return { success: true }
  } catch (error) {
    console.error("Forgot password error:", error)
    // Still return success to prevent email enumeration
    return { success: true }
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordData): Promise<ServiceResult> {
  try {
    if (data.newPassword !== data.confirmNewPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    const response = await publicFetch("/account/reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      }),
    })

    if (!response.ok) {
      const { error, errors } = await parseErrorResponse(response)
      return { success: false, error, errors }
    }

    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    return { success: false, error: "Failed to reset password" }
  }
}

// ============================================================================
// Authenticated endpoints
// ============================================================================

/**
 * Get current user profile
 */
export async function getProfile(): Promise<ServiceResult<UserProfile>> {
  try {
    const response = await authenticatedFetch("/account/me")

    if (!response.ok) {
      const { error } = await parseErrorResponse(response)
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Get profile error:", error)
    return { success: false, error: "Failed to get profile" }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: UpdateProfileData
): Promise<ServiceResult<UserProfile>> {
  try {
    const response = await authenticatedFetch("/account/me", {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const { error, errors } = await parseErrorResponse(response)
      return { success: false, error, errors }
    }

    const updatedProfile = await response.json()
    return { success: true, data: updatedProfile }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

/**
 * Change password (requires current password)
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<ServiceResult> {
  try {
    if (data.newPassword !== data.confirmNewPassword) {
      return { success: false, error: "New passwords do not match" }
    }

    const response = await authenticatedFetch("/account/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    })

    if (!response.ok) {
      const { error, errors } = await parseErrorResponse(response)
      return { success: false, error, errors }
    }

    return { success: true }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, error: "Failed to change password" }
  }
}

/**
 * Delete user account
 */
export async function deleteAccount(password?: string): Promise<ServiceResult> {
  try {
    const response = await authenticatedFetch("/account/me", {
      method: "DELETE",
      body: password ? JSON.stringify({ password }) : undefined,
    })

    if (!response.ok) {
      const { error } = await parseErrorResponse(response)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Delete account error:", error)
    return { success: false, error: "Failed to delete account" }
  }
}

/**
 * Refresh email (request new confirmation email with updated address)
 */
export async function refreshEmail(newEmail: string): Promise<ServiceResult> {
  try {
    const response = await authenticatedFetch("/account/refresh-email", {
      method: "POST",
      body: JSON.stringify({ newEmail }),
    })

    if (!response.ok) {
      const { error, errors } = await parseErrorResponse(response)
      return { success: false, error, errors }
    }

    return { success: true }
  } catch (error) {
    console.error("Refresh email error:", error)
    return { success: false, error: "Failed to update email" }
  }
}
