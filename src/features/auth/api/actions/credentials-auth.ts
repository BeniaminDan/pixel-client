"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

const API_BASE = process.env.API_BASE_URL + "auth/"

export interface LoginResult {
  success: boolean
  error?: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export interface RegisterResult {
  success: boolean
  error?: string
  requiresEmailConfirmation?: boolean
}

/**
 * Sign in with email and password using NextAuth credentials providers
 */
export async function loginWithCredentials(
  email: string,
  password: string,
  // callbackUrl?: string
): Promise<LoginResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    console.error("Credentials sign in error:", error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" }
        default:
          return { success: false, error: "An error occurred during sign in" }
      }
    }

    // Re-throw if it's a redirect (successful sign-in with redirect: true)
    throw error
  }
}

/**
 * Login action that can be used with form action
 */
export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  // const callbackUrl = formData.get("callbackUrl") as string || "/"
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  // return loginWithCredentials(email, password, callbackUrl)
  return loginWithCredentials(email, password)
}

/**
 * Register a new user account
 */
export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  try {
    // Validate passwords match if confirmPassword is provided
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    const response = await fetch(`${API_BASE}/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Handle validation errors
      if (response.status === 400) {
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors).flat()[0]
          return { success: false, error: firstError as string }
        }
        return { success: false, error: errorData.message || "Invalid registration data" }
      }

      // Handle conflict (email already exists)
      if (response.status === 409) {
        return { success: false, error: "An account with this email already exists" }
      }

      return { success: false, error: errorData.message || "Registration failed" }
    }

    return {
      success: true,
      requiresEmailConfirmation: true,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

/**
 * Register action that can be used with form action
 */
export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  return registerUser({
    email,
    password,
    confirmPassword,
    name,
  })
}

/**
 * Check if an email address is already registered
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE}/account/exists?email=${encodeURIComponent(email)}`,
      { method: "GET" }
    )

    if (response.ok) {
      const data = await response.json()
      return data.exists === true
    }

    return false
  } catch {
    return false
  }
}
