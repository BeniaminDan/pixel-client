"use server"

import { revalidatePath } from "next/cache"
import { signOut } from "@/lib/auth"
import {
  confirmEmail,
  resendConfirmation,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  refreshEmail,
} from "@/features/auth/api/services/account"

import type { UserProfile, UpdateProfileData, ChangePasswordData, ResetPasswordData, ServiceResult } from "@/features/auth/types"

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
  return confirmEmail(userId, token)
}

/**
 * Resend confirmation email action
 */
export async function resendConfirmationAction(
  email: string
): Promise<ServiceResult> {
  return resendConfirmation(email)
}

/**
 * Forgot password action - sends reset email
 */
export async function forgotPasswordAction(email: string): Promise<ServiceResult> {
  return forgotPassword(email)
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

  return forgotPassword(email)
}

/**
 * Reset password action
 */
export async function resetPasswordAction(
  data: ResetPasswordData
): Promise<ServiceResult> {
  return resetPassword(data)
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

  return resetPassword({
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
  return getProfile()
}

/**
 * Update user profile action
 */
export async function updateProfileAction(
  data: UpdateProfileData
): Promise<ServiceResult<UserProfile>> {
  const result = await updateProfile(data)

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
  return changePassword(data)
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

  return changePassword({
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
  const result = await deleteAccount(password)

  if (result.success) {
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
  const result = await refreshEmail(newEmail)

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
