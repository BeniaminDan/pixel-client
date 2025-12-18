import { auth } from "@/lib/auth"
import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL + "auth/"

/**
 * Get the access token from the NextAuth JWT cookie
 */
async function getAccessTokenFromCookie(): Promise<string | null> {
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
    console.error("Error decoding session token:", error)
    return null
  }
}

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  const { path } = await params

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check for token refresh errors
  if (session.error === "RefreshTokenError") {
    return NextResponse.json(
      { error: "Session expired, please sign in again" },
      { status: 401 }
    )
  }

  const accessToken = await getAccessTokenFromCookie()

  if (!accessToken) {
    return NextResponse.json({ error: "No access token available" }, { status: 401 })
  }

  const upstreamUrl = `${API_BASE}/${path.join("/")}`
  const headers = new Headers(req.headers)
  headers.set("Authorization", `Bearer ${accessToken}`)
  headers.delete("host")

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
  })

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  })
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE }
