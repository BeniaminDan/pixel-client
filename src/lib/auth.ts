import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
// cookies import removed

/** Extended user type with credential tokens */
interface CredentialUser extends User {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface JwtPayload {
  sub: string
  email: string
  name: string
  role: string
  permission: string | string[]
}

/**
 * Decode JWT token payload without verification
 * Note: This is safe because we only decode tokens we received directly from our trusted auth server
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT payload:', error)
    return null
  }
}

const OPENIDDICT_ISSUER = process.env.OPENIDDICT_ISSUER
const OPENIDDICT_CLIENT_ID = process.env.OPENIDDICT_CLIENT_ID
const OPENIDDICT_CLIENT_SECRET = process.env.OPENIDDICT_CLIENT_SECRET

// Cookie helper functions removed


/**
 * Refresh an access token using the refresh token grant
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Get refresh token from JWT
    const refreshToken = token.refreshToken as string | undefined
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const tokenEndpoint = `${OPENIDDICT_ISSUER}api/auth/connect/token`

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: OPENIDDICT_CLIENT_ID!,
        client_secret: OPENIDDICT_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
    })

    // Check if response has content before parsing
    const responseText = await response.text()
    if (!responseText) {
      throw new Error("Empty response from token endpoint")
    }

    let refreshedTokens
    try {
      refreshedTokens = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    if (!response.ok) {
      throw new Error(refreshedTokens.error || "Failed to refresh token")
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fallback to old refresh token if not allowed to rotate
      error: undefined,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshTokenError",
    }
  }
}

/**
 * Authenticate using Resource Owner Password Credentials (ROPC) grant
 */
async function authenticateWithPassword(
  email: string,
  password: string
): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: { id: string; email: string; name?: string }
} | null> {
  try {
    const tokenEndpoint = `${OPENIDDICT_ISSUER}api/auth/connect/token`

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: OPENIDDICT_CLIENT_ID!,
        client_secret: OPENIDDICT_CLIENT_SECRET!,
        username: email,
        password: password,
      }),
    })

    // Check if response has content before parsing
    const responseText = await response.text()
    if (!responseText) {
      console.error("ROPC authentication failed: Empty response", {
        status: response.status,
        statusText: response.statusText,
        url: tokenEndpoint,
      })
      return null
    }

    let tokens
    try {
      tokens = JSON.parse(responseText)
    } catch (parseError) {
      console.error("ROPC authentication failed: Invalid JSON response", {
        status: response.status,
        statusText: response.statusText,
        responseText,
        url: tokenEndpoint,
        parseError,
      })
      return null
    }

    if (!response.ok) {
      console.error("ROPC authentication failed:", {
        status: response.status,
        statusText: response.statusText,
        error: tokens.error,
        errorDescription: tokens.error_description,
        errorUri: tokens.error_uri,
        fullResponse: tokens,
        url: tokenEndpoint,
      })
      return null
    }

    // Fetch user info from the userinfo endpoint
    const userInfoResponse = await fetch(`${OPENIDDICT_ISSUER}api/auth/connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      const userInfoErrorText = await userInfoResponse.text()
      console.error("Failed to fetch user info:", {
        status: userInfoResponse.status,
        statusText: userInfoResponse.statusText,
        responseText: userInfoErrorText,
        url: `${OPENIDDICT_ISSUER}api/auth/connect/userinfo`,
      })
      return null
    }

    const userInfoText = await userInfoResponse.text()
    if (!userInfoText) {
      console.error("User info response is empty", {
        status: userInfoResponse.status,
        statusText: userInfoResponse.statusText,
        url: `${OPENIDDICT_ISSUER}api/auth/connect/userinfo`,
      })
      return null
    }

    let userInfo
    try {
      userInfo = JSON.parse(userInfoText)
    } catch (parseError) {
      console.error("Failed to parse user info JSON:", {
        responseText: userInfoText,
        parseError,
        url: `${OPENIDDICT_ISSUER}api/auth/connect/userinfo`,
      })
      return null
    }

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
    console.error("ROPC authentication error:", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      email,
      tokenEndpoint: `${OPENIDDICT_ISSUER}api/auth/connect/token`,
    })
    return null
  }
}

const config: NextAuthConfig = {
  debug: true,
  providers: [
    // OpenIddict OAuth2 providers for OAuth popup flow
    // Using OAuth2 type with explicit endpoints instead of OIDC discovery
    // because Auth.js v5 strips the path from issuer URLs during discovery
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oauth",
      issuer: OPENIDDICT_ISSUER, // Must match the 'iss' parameter returned by OpenIddict
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
    // Credentials providers for email/password login via ROPC
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

        console.log("Credentials authorize: Attempting authentication for", credentials.email)

        const result = await authenticateWithPassword(
          credentials.email as string,
          credentials.password as string
        )

        if (!result) {
          console.error("Credentials authorize: Authentication failed - authenticateWithPassword returned null")
          return null
        }

        console.log("Credentials authorize: Authentication successful for", credentials.email)

        // Store refresh token in HTTP-only cookie to reduce session cookie size
        // await setRefreshTokenCookie(result.refreshToken) // Cookie approach removed


        // Return user object with tokens attached for JWT callback
        // Note: refreshToken is stored in cookie, not in the returned user object
        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken, // Still passed for JWT callback, but won't be stored in JWT
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
    async jwt({ token, user, account }) {
      // Initial sign in via OAuth
      if (account && account.provider === "openiddict") {
        // Store refresh token in JWT
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token
        }
        // Store accessToken in JWT
        token.accessToken = account.access_token
        token.accessTokenExpiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 3600 * 1000

        // Decode access token to extract role and permissions
        if (account.access_token) {
          const payload = decodeJwtPayload(account.access_token)
          if (payload) {
            token.sub = payload.sub
            token.email = payload.email
            token.name = payload.name
            token.role = payload.role
            token.permissions = Array.isArray(payload.permission)
              ? payload.permission
              : payload.permission
                ? [payload.permission]
                : []
          }
        }

        return token
      }

      // Initial sign in via credentials
      if (user && "accessToken" in user) {
        const credentialUser = user as CredentialUser
        // Refresh token is passed from authorize
        token.refreshToken = credentialUser.refreshToken
        // Store accessToken in JWT
        token.accessToken = credentialUser.accessToken
        token.accessTokenExpiresAt = Date.now() + credentialUser.expiresIn * 1000
        token.sub = credentialUser.id
        token.email = credentialUser.email
        token.name = credentialUser.name

        // Decode access token to extract role and permissions
        const payload = decodeJwtPayload(credentialUser.accessToken)
        if (payload) {
          token.role = payload.role
          token.permissions = Array.isArray(payload.permission)
            ? payload.permission
            : payload.permission
              ? [payload.permission]
              : []
        }

        return token
      }

      // Return token if not expired (with 60s buffer)
      if (token.accessTokenExpiresAt && Date.now() < token.accessTokenExpiresAt - 60000) {
        return token
      }

      // Access token has expired, try to refresh it
      // refreshAccessToken will get refreshToken from JWT
      const refreshToken = token.refreshToken as string | undefined
      if (refreshToken) {
        const refreshedToken = await refreshAccessToken(token)

        // Decode the new access token to update role and permissions
        if (refreshedToken.accessToken && !refreshedToken.error) {
          const payload = decodeJwtPayload(refreshedToken.accessToken)
          if (payload) {
            refreshedToken.role = payload.role
            refreshedToken.permissions = Array.isArray(payload.permission)
              ? payload.permission
              : payload.permission
                ? [payload.permission]
                : []
          }
        }

        return refreshedToken
      }

      return token
    },

    async session({ session, token }) {
      // Keep session minimal - don't expose tokens to client by default
      session.user = session.user ?? {}

      if (token.sub) {
        session.user.id = token.sub
      }
      if (token.email) {
        session.user.email = token.email
      }
      if (token.name) {
        session.user.name = token.name
      }
      if (token.picture) {
        session.user.image = token.picture
      }
      if (token.role) {
        session.user.role = token.role
      }
      if (token.permissions) {
        session.user.permissions = token.permissions
      }

      // Expose error state for client-side handling
      if (token.error) {
        session.error = token.error
      }

      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)


// Export for usage in other files if needed
// export { clearRefreshTokenCookie } // Removed

// Export for server-side token access (e.g., in API proxy)
export async function getAccessToken(): Promise<string | null> {
  const session = await auth()
  if (!session) return null

  // Access the JWT token directly for server-side use
  // This requires accessing the internal token, which we do via a workaround
  return null // Token access is handled via the proxy route
}
