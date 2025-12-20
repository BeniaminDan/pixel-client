"use server"

import { signIn } from "@/modules/auth";
import type { ServiceResult } from "@/server/http/contracts";

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
