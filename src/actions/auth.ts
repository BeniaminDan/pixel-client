"use server"

import { signIn, signOut } from "@/auth"

export async function loginAction() {
  await signIn("openiddict", { redirectTo: "/" })
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}
