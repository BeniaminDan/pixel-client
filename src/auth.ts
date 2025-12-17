import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

/** Extended user type with credential tokens */
interface CredentialUser extends User {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

const OPENIDDICT_ISSUER = process.env.OPENIDDICT_ISSUER
const OPENIDDICT_CLIENT_ID = process.env.OPENIDDICT_CLIENT_ID
const OPENIDDICT_CLIENT_SECRET = process.env.OPENIDDICT_CLIENT_SECRET

/**
 * Refresh an access token using the refresh token grant
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
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
        refresh_token: token.refreshToken!,
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
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
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
    // OpenIddict OIDC provider for OAuth popup flow
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oidc",
      issuer: OPENIDDICT_ISSUER,
      clientId: OPENIDDICT_CLIENT_ID,
      clientSecret: OPENIDDICT_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid profile email offline_access pixel_api",
        },
      },
      checks: ["pkce", "state"],
    },
    // Credentials provider for email/password login via ROPC
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

        // Return user object with tokens attached for JWT callback
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
    async jwt({ token, user, account }) {
      // Initial sign in via OAuth
      if (account && account.provider === "openiddict") {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 3600 * 1000
        return token
      }

      // Initial sign in via credentials
      if (user && "accessToken" in user) {
        const credentialUser = user as CredentialUser
        token.accessToken = credentialUser.accessToken
        token.refreshToken = credentialUser.refreshToken
        token.accessTokenExpiresAt = Date.now() + credentialUser.expiresIn * 1000
        token.sub = credentialUser.id
        token.email = credentialUser.email
        token.name = credentialUser.name
        return token
      }

      // Return token if not expired (with 60s buffer)
      if (token.accessTokenExpiresAt && Date.now() < token.accessTokenExpiresAt - 60000) {
        return token
      }

      // Access token has expired, try to refresh it
      if (token.refreshToken) {
        return await refreshAccessToken(token)
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

      // Expose error state for client-side handling
      if (token.error) {
        session.error = token.error
      }

      return session
    },
  },

  logger: {
    error(code, ...message) {
      console.error(code, message)
    },
    warn(code, ...message) {
      console.warn(code, message)
    },
    debug(code, ...message) {
      console.debug(code, message)
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)

// Export for server-side token access (e.g., in API proxy)
export async function getAccessToken(): Promise<string | null> {
  const session = await auth()
  if (!session) return null

  // Access the JWT token directly for server-side use
  // This requires accessing the internal token, which we do via a workaround
  return null // Token access is handled via the proxy route
}