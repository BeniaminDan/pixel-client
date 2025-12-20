// --- ENUMS ---
export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// --- INTERFACES / TYPES ---

/** Defines the structure for a user object. */
export interface User {
  id: string
  name?: string
  email: string
  image?: string
  emailConfirmed?: boolean
  createdAt: string
  updatedAt?: string
}

/** Defines the structure for a blog post object. */
export interface Post {
  id: number
  title: string
  content: string
  status: PostStatus
  authorId: number
}

// --- AUTHENTICATION & ACCOUNT TYPES ---

/** Registration request payload */
export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

/** Login request payload (for ROPC) */
export interface LoginRequest {
  email: string
  password: string
}

/** Password reset request payload */
export interface PasswordResetRequest {
  email: string
  token: string
  newPassword: string
}

/** Change password request payload */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/** Update profile request payload */
export interface UpdateProfileRequest {
  name?: string
}

/** Email confirmation request */
export interface EmailConfirmationRequest {
  userId: string
  token: string
}

/** Forgot password request */
export interface ForgotPasswordRequest {
  email: string
}

/** OAuth token response from OpenIddict */
export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
  id_token?: string
}

/** User info from OpenIddict userinfo endpoint */
export interface UserInfo {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
}




