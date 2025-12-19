"use server"

import { signIn } from "@/lib/auth"
import { AuthService } from "@/services/auth.service"
import { createPublicClient } from "@/lib/api/factory"
import { handleApiErrorSilently } from "@/lib/api/errors"
import type { ServiceResult } from "@/features/auth/types"

/**
 * Login with email and password using credentials provider
 * This uses the NextAuth credentials provider which internally calls the ROPC grant flow
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<ServiceResult> {
  try {
    // Use NextAuth's signIn with credentials provider
    // The authorize callback in lib/auth.ts handles the actual authentication
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    // signIn returns void when redirect is false, but throws on error
    // If we reach here, login was successful
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "Invalid email or password",
    }
  }
}

/**
 * Register a new user account
 * After successful registration, returns success message
 */
export async function registerUser(data: {
  email: string
  password: string
  confirmPassword: string
  name?: string
}): Promise<ServiceResult> {
  try {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      }
    }

    // Create auth service instance
    const authService = new AuthService(createPublicClient())

    // Register the user
    await authService.register({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      name: data.name,
    })

    // Registration successful - user needs to confirm email
    return {
      success: true,
    }
  } catch (error) {
    const apiError = handleApiErrorSilently(error)
    return {
      success: false,
      error: apiError.userMessage,
      errors: apiError.details,
    }
  }
}
