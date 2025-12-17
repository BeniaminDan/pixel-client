import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError"
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
    error?: "RefreshTokenError"
    sub?: string
    name?: string
    email?: string
    picture?: string
  }
}
