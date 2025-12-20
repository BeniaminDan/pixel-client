/**
 * @fileoverview Admin service for user management and moderation
 */

import type { AxiosInstance } from 'axios'
import { BaseService, createAdminClient } from "@/server/http/infrastructure";
import {
  AdminUser,
  BanUserRequest, ContentReport, ModerationAction, SystemStats,
  UpdateUserRequest,
  UserListQuery,
  UserListResponse
} from '@/server/http/contracts/account';

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
