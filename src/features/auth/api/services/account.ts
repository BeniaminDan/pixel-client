/**
 * @fileoverview Account management service for interacting with the backend API.
 * All functions in this service are designed to be called from server actions.
 * Migrated to use axios architecture.
 */

import type { UserProfile, UpdateProfileData, ChangePasswordData, ResetPasswordData, ServiceResult } from "@/features/auth/types"
import { AccountSetupService } from "@/services/account-setup.service"
import { AccountService } from "@/services/account.service"
import { createAuthenticatedClient, createPublicClient } from "@/lib/api/factory"
import { attachAuthInterceptor, createServerTokenGetter } from "@/lib/api/interceptors"
import { handleApiErrorSilently } from "@/lib/api/errors"

/**
 * Create server-side authenticated client with token getter and refresh
 */
function createServerAuthenticatedClient() {
  const client = createAuthenticatedClient()
  attachAuthInterceptor(client, {
    getToken: createServerTokenGetter(),
    refreshToken: async () => {
      // Import dynamically to avoid circular dependencies
      const { refreshServerAccessToken } = await import('@/features/auth/lib/auth')
      return refreshServerAccessToken()
    },
    autoRefresh: true,
  })
  return client
}

/**
 * Create server-side account setup service
 */
function createServerAccountSetupService() {
  return new AccountSetupService(createPublicClient())
}

/**
 * Create server-side account service
 */
function createServerAccountService() {
  return new AccountService(createServerAuthenticatedClient())
}

// ============================================================================
// Public (unauthenticated) endpoints
// ============================================================================

/**
 * Register a new user account
 */
export async function register(data: {
  email: string
  password: string
  confirmPassword: string
  name?: string
}): Promise<ServiceResult> {
  try {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    const accountSetupService = createServerAccountSetupService()
    await accountSetupService.register(data)
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return {
      success: false,
      error: apiError.userMessage,
      errors: apiError.details
    }
  }
}

/**
 * Confirm email address with token
 */
export async function confirmEmail(
  userId: string,
  token: string
): Promise<ServiceResult> {
  try {
    const accountSetupService = createServerAccountSetupService()
    await accountSetupService.confirmEmail({ userId, token })
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}

/**
 * Resend email confirmation
 */
export async function resendConfirmation(email: string): Promise<ServiceResult> {
  try {
    const accountSetupService = createServerAccountSetupService()
    await accountSetupService.resendConfirmation(email)
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}

/**
 * Request password reset email
 */
export async function forgotPassword(email: string): Promise<ServiceResult> {
  try {
    const accountSetupService = createServerAccountSetupService()
    await accountSetupService.forgotPassword({ email })
    // Always return success to prevent email enumeration
    return { success: true }
  } catch (error) {
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

    const { email, token, newPassword, confirmNewPassword } = data;
    const accountSetupService = createServerAccountSetupService()
    await accountSetupService.resetPassword({
      email,
      token,
      newPassword,
      confirmNewPassword,
    })
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return {
      success: false,
      error: apiError.userMessage,
      errors: apiError.details
    }
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
    const accountService = createServerAccountService()
    const data = await accountService.getProfile()
    return { success: true, data: data as UserProfile }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: UpdateProfileData
): Promise<ServiceResult<UserProfile>> {
  try {
    const accountService = createServerAccountService()
    const updatedProfile = await accountService.updateProfile(data)
    return { success: true, data: updatedProfile as UserProfile }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return {
      success: false,
      error: apiError.userMessage,
      errors: apiError.details
    }
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

    const accountService = createServerAccountService()
    await accountService.changePassword(data)
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return {
      success: false,
      error: apiError.userMessage,
      errors: apiError.details
    }
  }
}

/**
 * Delete user account
 */
export async function deleteAccount(password?: string): Promise<ServiceResult> {
  try {
    const accountService = createServerAccountService()
    await accountService.deleteAccount(password)
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return { success: false, error: apiError.userMessage }
  }
}

/**
 * Refresh email (request new confirmation email with updated address)
 */
export async function refreshEmail(newEmail: string): Promise<ServiceResult> {
  try {
    const accountService = createServerAccountService()
    await accountService.updateEmail({ newEmail })
    return { success: true }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return {
      success: false,
      error: apiError.userMessage,
      errors: apiError.details
    }
  }
}
