import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError"
    accessToken?: string
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role?: string
      permissions?: string[]
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role?: string
    permissions?: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    // refreshToken is NOT stored in JWT to reduce session cookie size
    // It's stored in a separate HTTP-only cookie instead
    refreshToken?: string // Only used during initial sign-in, not persisted in JWT
    accessTokenExpiresAt?: number
    error?: "RefreshTokenError"
    sub?: string
    name?: string
    email?: string
    picture?: string
    role?: string
    permissions?: string[]
  }
}
