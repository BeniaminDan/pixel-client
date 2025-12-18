"use server"

import { revalidatePath } from "next/cache"
import { signOut, clearRefreshTokenCookie } from "@/lib/auth"
import {
  confirmEmail as confirmEmailService,
  resendConfirmation as resendConfirmationService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
  deleteAccount as deleteAccountService,
  refreshEmail as refreshEmailService,
  type UserProfile,
  type UpdateProfileData,
  type ChangePasswordData,
  type ResetPasswordData,
  type ServiceResult,
} from "@/features/auth/api/services/account"

// Re-export types for convenience
export type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ResetPasswordData,
  ServiceResult,
}

// ============================================================================
// Public (unauthenticated) actions
// ============================================================================

/**
 * Confirm email address action
 */
export async function confirmEmailAction(
  userId: string,
  token: string
): Promise<ServiceResult> {
  return confirmEmailService(userId, token)
}

/**
 * Resend confirmation email action
 */
export async function resendConfirmationAction(
  email: string
): Promise<ServiceResult> {
  return resendConfirmationService(email)
}

/**
 * Forgot password action - sends reset email
 */
export async function forgotPasswordAction(email: string): Promise<ServiceResult> {
  return forgotPasswordService(email)
}

/**
 * Forgot password form action
 */
export async function forgotPasswordFormAction(
  formData: FormData
): Promise<ServiceResult> {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  return forgotPasswordService(email)
}

/**
 * Reset password action
 */
export async function resetPasswordAction(
  data: ResetPasswordData
): Promise<ServiceResult> {
  return resetPasswordService(data)
}

/**
 * Reset password form action
 */
export async function resetPasswordFormAction(
  formData: FormData
): Promise<ServiceResult> {
  const email = formData.get("email") as string
  const token = formData.get("token") as string
  const newPassword = formData.get("newPassword") as string
  const confirmNewPassword = formData.get("confirmNewPassword") as string

  if (!email || !token || !newPassword) {
    return { success: false, error: "All fields are required" }
  }

  return resetPasswordService({
    email,
    token,
    newPassword,
    confirmNewPassword,
  })
}

// ============================================================================
// Authenticated actions
// ============================================================================

/**
 * Get current user profile action
 */
export async function getProfileAction(): Promise<ServiceResult<UserProfile>> {
  return getProfileService()
}

/**
 * Update user profile action
 */
export async function updateProfileAction(
  data: UpdateProfileData
): Promise<ServiceResult<UserProfile>> {
  const result = await updateProfileService(data)

  if (result.success) {
    revalidatePath("/profile")
    revalidatePath("/settings")
  }

  return result
}

/**
 * Update profile form action
 */
export async function updateProfileFormAction(
  formData: FormData
): Promise<ServiceResult<UserProfile>> {
  const name = formData.get("name") as string

  return updateProfileAction({ name })
}

/**
 * Change password action
 */
export async function changePasswordAction(
  data: ChangePasswordData
): Promise<ServiceResult> {
  return changePasswordService(data)
}

/**
 * Change password form action
 */
export async function changePasswordFormAction(
  formData: FormData
): Promise<ServiceResult> {
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmNewPassword = formData.get("confirmNewPassword") as string

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return { success: false, error: "All fields are required" }
  }

  return changePasswordService({
    currentPassword,
    newPassword,
    confirmNewPassword,
  })
}

/**
 * Delete account action
 */
export async function deleteAccountAction(
  password?: string
): Promise<ServiceResult> {
  const result = await deleteAccountService(password)

  if (result.success) {
    // Clear refresh token cookie and sign out the user after account deletion
    await clearRefreshTokenCookie()
    await signOut({ redirectTo: "/" })
  }

  return result
}

/**
 * Delete account form action
 */
export async function deleteAccountFormAction(
  formData: FormData
): Promise<ServiceResult> {
  const password = formData.get("password") as string
  return deleteAccountAction(password)
}

/**
 * Refresh/update email action
 */
export async function refreshEmailAction(
  newEmail: string
): Promise<ServiceResult> {
  const result = await refreshEmailService(newEmail)

  if (result.success) {
    revalidatePath("/profile")
    revalidatePath("/settings")
  }

  return result
}

/**
 * Refresh email form action
 */
export async function refreshEmailFormAction(
  formData: FormData
): Promise<ServiceResult> {
  const newEmail = formData.get("newEmail") as string

  if (!newEmail) {
    return { success: false, error: "New email is required" }
  }

  return refreshEmailAction(newEmail)
}
