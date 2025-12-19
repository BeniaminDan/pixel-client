/**
 * @fileoverview Account setup and recovery operations
 * 
 * This service handles operations that are NOT part of the OAuth2 flow:
 * - User registration
 * - Email confirmation
 * - Password reset/recovery
 * 
 * For login/logout/session management, use NextAuth (lib/auth.ts)
 */

import type { AxiosInstance } from 'axios'
import { BaseService } from './base.service'
import { createPublicClient } from '@/lib/api/factory'

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

export interface EmailConfirmationData {
    userId: string
    token: string
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

/**
 * Account setup and recovery service
 * 
 * Note: This service uses the public client since these endpoints don't require authentication.
 * For login/logout, use NextAuth signIn() and signOut() functions instead.
 */
export class AccountSetupService extends BaseService {
    constructor(client?: AxiosInstance) {
        super(client || createPublicClient())
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
}
