/**
 * @fileoverview Account service for user profile and settings management
 */

import { BaseService } from './base.service'

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  permissions?: string[]
  emailConfirmed: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface UpdateEmailData {
  newEmail: string
}

/**
 * Account service for user profile management
 */
export class AccountService extends BaseService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>('/account/me')
    return response.data
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await this.client.put<UserProfile>('/account/me', data)
    return response.data
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await this.client.post('/account/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  /**
   * Update email address (requires confirmation)
   */
  async updateEmail(data: UpdateEmailData): Promise<void> {
    await this.client.post('/account/update-email', data)
  }

  /**
   * Delete user account
   */
  async deleteAccount(password?: string): Promise<void> {
    await this.client.delete('/account/me', {
      data: password ? { password } : undefined,
    })
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await this.client.post<{ url: string }>('/account/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  /**
   * Delete avatar
   */
  async deleteAvatar(): Promise<void> {
    await this.client.delete('/account/avatar')
  }
}
