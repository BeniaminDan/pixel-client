import { auth } from "@/lib/auth"
import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

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

  // Prepare headers for upstream request
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    // Skip host header and copy all others
    if (key.toLowerCase() !== 'host') {
      headers[key] = value
    }
  })
  headers['Authorization'] = `Bearer ${accessToken}`

  try {
    // Prepare request body
    let data: ArrayBuffer | undefined
    if (req.method !== "GET" && req.method !== "HEAD") {
      data = await req.arrayBuffer()
    }

    // Make upstream request using axios
    const response = await axios({
      method: req.method,
      url: upstreamUrl,
      headers,
      data,
      responseType: 'arraybuffer', // Handle binary responses
      validateStatus: () => true, // Don't throw on any status code
    })

    // Convert axios response to NextResponse
    return new NextResponse(response.data, {
      status: response.status,
      headers: response.headers as HeadersInit,
    })
  } catch (error) {
    console.error("Proxy request failed:", error)
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500 }
    )
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE }
