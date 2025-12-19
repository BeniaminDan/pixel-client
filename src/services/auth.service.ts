/**
 * @fileoverview Authentication service for login, register, and password operations
 */

import type { AxiosInstance } from 'axios'
import { BaseService } from './base.service'
import { createPublicClient } from '@/lib/api/factory'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  newPassword: string
  confirmNewPassword: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    name?: string
  }
}

export interface EmailConfirmationData {
  userId: string
  token: string
}

/**
 * Authentication service
 * Note: This service uses the public client since auth endpoints don't require authentication
 */
export class AuthService extends BaseService {
  constructor(client?: AxiosInstance) {
    super(client || createPublicClient())
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  /**
   * Request password reset email
   */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await this.client.post('/auth/forgot-password', data)
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.client.post('/auth/reset-password', data)
  }

  /**
   * Confirm email address with token
   */
  async confirmEmail(data: EmailConfirmationData): Promise<void> {
    await this.client.get('/auth/confirm-email', {
      params: {
        userId: data.userId,
        token: data.token,
      },
    })
  }

  /**
   * Resend email confirmation
   */
  async resendConfirmation(email: string): Promise<void> {
    await this.client.post('/auth/resend-confirmation', { email })
  }

  /**
   * Logout (client-side only, just clears session)
   */
  async logout(): Promise<void> {
    // In NextAuth, logout is handled client-side via signOut()
    // This method is a placeholder for any server-side cleanup
    await this.client.post('/auth/logout')
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  }
}
