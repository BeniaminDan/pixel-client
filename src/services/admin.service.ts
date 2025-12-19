/**
 * @fileoverview Admin service for user management and moderation
 */

import type { AxiosInstance } from 'axios'
import { BaseService } from './base.service'
import { createAdminClient } from '@/lib/api/factory'

export interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
  permissions: string[]
  emailConfirmed: boolean
  banned: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  stats: {
    totalPixels: number
    totalBids: number
    totalSpent: number
  }
}

export interface UserListQuery {
  page?: number
  pageSize?: number
  search?: string
  role?: string
  banned?: boolean
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  users: AdminUser[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: string
  permissions?: string[]
  emailConfirmed?: boolean
}

export interface BanUserRequest {
  reason: string
  duration?: number // Duration in days, undefined for permanent
  notifyUser?: boolean
}

export interface ModerationAction {
  id: string
  type: 'ban' | 'unban' | 'warn' | 'delete_content' | 'restore_content'
  targetUserId: string
  moderatorId: string
  reason: string
  createdAt: string
  expiresAt?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  totalPixels: number
  totalBids: number
  totalRevenue: number
  activeSessions: number
  serverHealth: {
    status: 'healthy' | 'degraded' | 'down'
    uptime: number
    memory: {
      used: number
      total: number
      percentage: number
    }
    cpu: {
      usage: number
    }
  }
}

export interface ContentReport {
  id: string
  type: 'pixel' | 'user' | 'other'
  targetId: string
  reporterId: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
}

/**
 * Admin service for user management and moderation
 * Note: This service uses the admin client which includes role checking
 */
export class AdminService extends BaseService {
  constructor(client?: AxiosInstance) {
    super(client || createAdminClient())
  }

  // ============================================================================
  // User Management
  // ============================================================================

  /**
   * Get list of users with filtering and pagination
   */
  async getUsers(query: UserListQuery = {}): Promise<UserListResponse> {
    const response = await this.client.get<UserListResponse>('/admin/users', {
      params: query,
    })
    return response.data
  }

  /**
   * Get single user by ID
   */
  async getUser(userId: string): Promise<AdminUser> {
    const response = await this.client.get<AdminUser>(`/admin/users/${userId}`)
    return response.data
  }

  /**
   * Update user details
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<AdminUser> {
    const response = await this.client.put<AdminUser>(`/admin/users/${userId}`, data)
    return response.data
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    await this.client.delete(`/admin/users/${userId}`)
  }

  /**
   * Ban user
   */
  async banUser(userId: string, data: BanUserRequest): Promise<void> {
    await this.client.post(`/admin/users/${userId}/ban`, data)
  }

  /**
   * Unban user
   */
  async unbanUser(userId: string): Promise<void> {
    await this.client.post(`/admin/users/${userId}/unban`)
  }

  /**
   * Reset user password (admin action)
   */
  async resetUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
    const response = await this.client.post<{ temporaryPassword: string }>(
      `/admin/users/${userId}/reset-password`
    )
    return response.data
  }

  /**
   * Impersonate user (for support purposes)
   */
  async impersonateUser(userId: string): Promise<{ token: string }> {
    const response = await this.client.post<{ token: string }>(
      `/admin/users/${userId}/impersonate`
    )
    return response.data
  }

  // ============================================================================
  // Moderation
  // ============================================================================

  /**
   * Get moderation action history
   */
  async getModerationActions(userId?: string): Promise<ModerationAction[]> {
    const params = userId ? { userId } : undefined
    const response = await this.client.get<ModerationAction[]>('/admin/moderation/actions', {
      params,
    })
    return response.data
  }

  /**
   * Get content reports
   */
  async getContentReports(status?: string): Promise<ContentReport[]> {
    const params = status ? { status } : undefined
    const response = await this.client.get<ContentReport[]>('/admin/moderation/reports', {
      params,
    })
    return response.data
  }

  /**
   * Resolve content report
   */
  async resolveReport(reportId: string, resolution: string): Promise<void> {
    await this.client.post(`/admin/moderation/reports/${reportId}/resolve`, {
      resolution,
    })
  }

  /**
   * Dismiss content report
   */
  async dismissReport(reportId: string, reason: string): Promise<void> {
    await this.client.post(`/admin/moderation/reports/${reportId}/dismiss`, {
      reason,
    })
  }

  /**
   * Delete pixel (moderation action)
   */
  async deletePixel(x: number, y: number, reason: string): Promise<void> {
    await this.client.delete(`/admin/pixels/${x}/${y}`, {
      data: { reason },
    })
  }

  /**
   * Restore deleted pixel
   */
  async restorePixel(x: number, y: number): Promise<void> {
    await this.client.post(`/admin/pixels/${x}/${y}/restore`)
  }

  // ============================================================================
  // Analytics & Stats
  // ============================================================================

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    const response = await this.client.get<SystemStats>('/admin/stats')
    return response.data
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    newUsers: number
    activeUsers: number
    churnedUsers: number
    retentionRate: number
  }> {
    const response = await this.client.get('/admin/analytics/users', {
      params: { startDate, endDate },
    })
    return response.data
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    totalRevenue: number
    totalTransactions: number
    averageTransactionValue: number
    revenueByDay: Array<{ date: string; revenue: number }>
  }> {
    const response = await this.client.get('/admin/analytics/revenue', {
      params: { startDate, endDate },
    })
    return response.data
  }

  /**
   * Get canvas analytics
   */
  async getCanvasAnalytics(): Promise<{
    totalPixels: number
    activePixels: number
    pixelPlacementRate: number
    topColors: Array<{ color: string; count: number }>
    heatmap: Array<{ x: number; y: number; activity: number }>
  }> {
    const response = await this.client.get('/admin/analytics/canvas')
    return response.data
  }

  // ============================================================================
  // Settings Management
  // ============================================================================

  /**
   * Get system settings
   */
  async getSettings(): Promise<Record<string, unknown>> {
    const response = await this.client.get('/admin/settings')
    return response.data
  }

  /**
   * Update system settings
   */
  async updateSettings(settings: Record<string, unknown>): Promise<void> {
    await this.client.put('/admin/settings', settings)
  }

  /**
   * Clear cache
   */
  async clearCache(cacheKey?: string): Promise<void> {
    await this.client.post('/admin/cache/clear', {
      key: cacheKey,
    })
  }

  /**
   * Run maintenance task
   */
  async runMaintenance(task: string): Promise<{ status: string; message: string }> {
    const response = await this.client.post<{ status: string; message: string }>(
      '/admin/maintenance',
      { task }
    )
    return response.data
  }
}

// Singleton instance
let adminServiceInstance: AdminService | null = null

/**
 * Get singleton admin service instance
 */
export function getAdminService(): AdminService {
  if (!adminServiceInstance) {
    adminServiceInstance = new AdminService()
  }
  return adminServiceInstance
}
