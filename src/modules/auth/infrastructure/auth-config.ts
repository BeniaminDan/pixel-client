import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { authTokenClient, authJsonClient, createTokenParams, extractOAuth2Error, type OAuth2TokenResponse } from "@/modules/auth";

/**
 * Constants
 */
const TOKEN_EXPIRY_BUFFER_MS = 60000 // 60 seconds buffer before token expiry
const DEFAULT_TOKEN_EXPIRY_MS = 3600 * 1000 // 1 hour

/**
 * Environment variables
 */
const OPENIDDICT_ISSUER = process.env.OPENIDDICT_ISSUER
const OPENIDDICT_CLIENT_ID = process.env.OPENIDDICT_CLIENT_ID
const OPENIDDICT_CLIENT_SECRET = process.env.OPENIDDICT_CLIENT_SECRET

/**
 * Type Definitions
 */

/** Extended user type with credential tokens */
interface CredentialUser extends User {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/** JWT payload structure from OpenIddict access token */
interface JwtPayload {
  sub: string
  email: string
  name: string
  role: string
  permission: string | string[]
}

/** Authentication result from password grant */
interface AuthenticationResult {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    name?: string
  }
}

/** User info response from OpenIddict */
interface UserInfo {
  sub: string
  email: string
  name?: string
  [key: string]: unknown
}

/**
 * Helper Functions
 */

/**
 * Decode JWT token payload without verification
 * 
 * Note: This is safe because we only decode tokens we received directly from our trusted auth server.
 * For production use, consider using a library like jose for proper JWT verification.
 * 
 * @param token - JWT token string
 * @returns Decoded payload or null if decoding fails
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')

    return JSON.parse(jsonPayload) as JwtPayload
  } catch (error) {
    console.error('Failed to decode JWT payload:', error)
    return null
  }
}

/**
 * Normalize permissions from JWT payload to array format
 * 
 * @param permission - Permission value from JWT (can be string, array, or undefined)
 * @returns Array of permission strings
 */
function normalizePermissions(permission: string | string[] | undefined): string[] {
  if (!permission) return []
  return Array.isArray(permission) ? permission : [permission]
}

/**
 * Authentication Functions
 */

/**
 * Refresh an access token using the refresh token grant
 * 
 * @param token - Current JWT token
 * @returns Updated JWT token with new access token or error state
 */
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const refreshToken = token.refreshToken as string | undefined
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const params = createTokenParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })

    const response = await authTokenClient.post<OAuth2TokenResponse>("/token", params)
    const refreshedTokens = response.data
    console.log("Refreshed access token:", refreshedTokens)
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    }
  } catch (error) {
    const oauth2Error = extractOAuth2Error(error)
    console.error("Error refreshing access token:", {
      error: oauth2Error.error,
      description: oauth2Error.errorDescription,
      status: oauth2Error.status,
    })

    return {
      ...token,
      error: "RefreshTokenError",
    }
  }
}

/**
 * Authenticate using Resource Owner Password Credentials (ROPC) grant
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Authentication result with tokens and user info, or null if authentication fails
 */
async function authenticateWithPassword(
  email: string,
  password: string
): Promise<AuthenticationResult | null> {
  try {
    // Step 1: Request access token using Resource Owner Password Credentials (ROPC) grant
    const params = createTokenParams({
      grant_type: "password",
      username: email,
      password,
    })

    const tokenResponse = await authTokenClient.post<OAuth2TokenResponse>("/token", params)
    const tokens = tokenResponse.data

    // Step 2: Fetch user info from the userinfo endpoint
    const userInfoResponse = await authJsonClient.get<UserInfo>("/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const userInfo = userInfoResponse.data

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      user: {
        id: userInfo.sub,
        email: userInfo.email || email,
        name: userInfo.name,
      },
    }
  } catch (error) {
    const oauth2Error = extractOAuth2Error(error)
    console.error("ROPC authentication failed:", {
      error: oauth2Error.error,
      description: oauth2Error.errorDescription,
      status: oauth2Error.status,
      email,
    })
    return null
  }
}

/**
 * Extract and populate JWT token with user data from access token payload
 * 
 * @param token - JWT token to populate
 * @param accessToken - Access token to decode
 * @returns Updated token with user data and permissions
 */
function populateTokenFromAccessToken(token: JWT, accessToken: string): JWT {
  const payload = decodeJwtPayload(accessToken)
  if (!payload) return token

  return {
    ...token,
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    permissions: normalizePermissions(payload.permission),
  }
}

/**
 * NextAuth Configuration
 */
const config: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    /**
     * OpenIddict OAuth2 provider for OAuth popup flow
     * 
     * Note: Using explicit endpoints instead of OIDC discovery because
     * Auth.js v5 strips the path from issuer URLs during discovery
     */
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oauth",
      issuer: OPENIDDICT_ISSUER,
      clientId: OPENIDDICT_CLIENT_ID,
      clientSecret: OPENIDDICT_CLIENT_SECRET,
      authorization: {
        url: `${OPENIDDICT_ISSUER}api/auth/connect/authorize`,
      },
      token: {
        url: `${OPENIDDICT_ISSUER}api/auth/connect/token`,
      },
      userinfo: {
        url: `${OPENIDDICT_ISSUER}api/auth/connect/userinfo`,
      },
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
        }
      },
    },
    /**
     * Credentials provider for email/password login via Resource Owner Password Credentials (ROPC)
     */
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credentials authorize: Missing email or password")
          return null
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Credentials authorize: Attempting authentication for", credentials.email)
        }

        const result = await authenticateWithPassword(
          credentials.email as string,
          credentials.password as string
        )

        if (!result) {
          console.error("Credentials authorize: Authentication failed")
          return null
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Credentials authorize: Authentication successful for", credentials.email)
        }

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
        } as CredentialUser
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * JWT callback - called whenever a JWT is created or updated
     */
    async jwt({ token, user, account }) {
      // Handle initial sign in via OAuth
      if (account && account.provider === "openiddict") {
        token.refreshToken = account.refresh_token
        token.accessToken = account.access_token
        token.accessTokenExpiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + DEFAULT_TOKEN_EXPIRY_MS

        // Decode access token to extract user data, role and permissions
        if (account.access_token) {
          return populateTokenFromAccessToken(token, account.access_token)
        }

        return token
      }

      // Handle initial sign in via credentials
      if (user && "accessToken" in user) {
        const credentialUser = user as CredentialUser

        token.refreshToken = credentialUser.refreshToken
        token.accessToken = credentialUser.accessToken
        token.accessTokenExpiresAt = Date.now() + credentialUser.expiresIn * 1000
        token.sub = credentialUser.id
        token.email = credentialUser.email
        token.name = credentialUser.name

        // Decode access token to extract role and permissions
        return populateTokenFromAccessToken(token, credentialUser.accessToken)
      }

      // Return token if not expired (with buffer to prevent edge cases)
      const expiresAt = token.accessTokenExpiresAt as number | undefined
      if (expiresAt && Date.now() < expiresAt - TOKEN_EXPIRY_BUFFER_MS) {
        return token
      }

      // Access token has expired, attempt to refresh it
      const refreshToken = token.refreshToken as string | undefined
      if (refreshToken) {
        const refreshedToken = await refreshAccessToken(token)

        // Decode the new access token to update user data, role and permissions
        if (refreshedToken.accessToken && !refreshedToken.error) {
          return populateTokenFromAccessToken(refreshedToken, refreshedToken.accessToken as string)
        }

        return refreshedToken
      }

      return token
    },

    /**
     * Session callback - called whenever a session is accessed
     * 
     * Note: Keep session minimal and don't expose sensitive tokens to client
     */
    async session({ session, token }) {
      session.user = session.user ?? {}

      // Populate user data from token
      if (token.sub) session.user.id = token.sub
      if (token.email) session.user.email = token.email
      if (token.name) session.user.name = token.name
      if (token.picture) session.user.image = token.picture
      if (token.role) session.user.role = token.role
      if (token.permissions) session.user.permissions = token.permissions

      // Expose error state for client-side handling (e.g., redirect to login)
      if (token.error) session.error = token.error

      return session
    },
  },
}

/**
 * NextAuth Exports
 */
export const { handlers, auth, signIn, signOut } = NextAuth(config)

/**
 * Get access token for server-side use
 * 
 * Note: Access token retrieval is handled via the API proxy route
 * which extracts the token directly from the session cookie.
 * 
 * @returns null - Token access is delegated to the proxy route
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await auth()
  if (!session) return null

  // Token access is handled via the API proxy route
  return null
}

/**
 * Server-side token refresh for use in axios interceptors
 * 
 * This function refreshes the access token by retrieving the current session,
 * extracting the refresh token, and calling the refreshAccessToken function.
 * 
 * @returns New access token or null if refresh fails
 */
export async function refreshServerAccessToken(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers')
    const { decode } = await import('next-auth/jwt')

    const cookieStore = await cookies()
    const sessionToken =
      cookieStore.get('authjs.session-token')?.value ||
      cookieStore.get('__Secure-authjs.session-token')?.value

    if (!sessionToken) {
      console.error('No session token found for refresh')
      return null
    }

    const decoded = await decode({
      token: sessionToken,
      secret: process.env.AUTH_SECRET!,
      salt:
        process.env.NODE_ENV === 'production'
          ? '__Secure-authjs.session-token'
          : 'authjs.session-token',
    })

    if (!decoded) {
      console.error('Failed to decode session token')
      return null
    }

    // Refresh the token
    const refreshedToken = await refreshAccessToken(decoded as JWT)

    if (refreshedToken.error) {
      console.error('Token refresh failed:', refreshedToken.error)
      return null
    }

    return (refreshedToken.accessToken as string) || null
  } catch (error) {
    console.error('Server-side token refresh error:', error)
    return null
  }
}
