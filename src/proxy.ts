import { NextResponse } from "next/server"
import { auth } from "@/auth"

/**
 * Routes that require authentication
 * Using path patterns for matching
 */
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
]

/**
 * Routes that are only accessible to non-authenticated users
 * Authenticated users will be redirected to home
 */
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

/**
 * Check if a path matches any of the protected routes
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

/**
 * Check if a path is an auth-only route (login, register, etc.)
 */
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const pathname = nextUrl.pathname

  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedRoute(pathname)) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl.origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check for token refresh errors
    if (req.auth?.error === "RefreshTokenError") {
      const loginUrl = new URL("/login", nextUrl.origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      loginUrl.searchParams.set("error", "SessionExpired")
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle auth routes - redirect to home if already authenticated
  if (isAuthRoute(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}
