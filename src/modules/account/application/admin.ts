/**
 * @fileoverview Admin service layer for server actions
 * All functions in this service are designed to be called from server actions.
 */

import type { ServiceResult } from "@/server/http/contracts";
import { AdminService } from "@/modules/account/infrastructure/admin-service";
import { createAdminClient } from "@/server/http/infrastructure";
import { attachAuthInterceptor, createServerTokenGetter, handleApiErrorSilently } from "@/server/http/application";

import type {
    AdminUser,
    UserListQuery,
    UserListResponse,
    UpdateUserRequest,
    BanUserRequest,
    ModerationAction,
    SystemStats,
    ContentReport
} from "@/server/http/contracts";

/**
 * Create a server-side admin client with token getter and refresh
 */
function createServerAdminClient() {
    const client = createAdminClient()
    attachAuthInterceptor(client, {
        getToken: createServerTokenGetter(),
        refreshToken: async () => {
            const { refreshServerAccessToken } = await import('@/modules/auth')
            return refreshServerAccessToken()
        },
        autoRefresh: true,
    })
    return client
}

/**
 * Create server-side admin service
 */
function createServerAdminService() {
    return new AdminService(createServerAdminClient())
}

// ============================================================================
// User Management
// ============================================================================

/**
 * Get list of users with filtering and pagination
 */
export async function getUsers(query?: UserListQuery): Promise<ServiceResult<UserListResponse>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getUsers(query)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get single user by ID
 */
export async function getUser(userId: string): Promise<ServiceResult<AdminUser>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getUser(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Update user details
 */
export async function updateUser(
    userId: string,
    data: UpdateUserRequest
): Promise<ServiceResult<AdminUser>> {
    try {
        const adminService = createServerAdminService()
        const updatedUser = await adminService.updateUser(userId, data)
        return { success: true, data: updatedUser }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage, errors: apiError.details }
    }
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.deleteUser(userId)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Ban user
 */
export async function banUser(userId: string, data: BanUserRequest): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.banUser(userId, data)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage, errors: apiError.details }
    }
}

/**
 * Unban user
 */
export async function unbanUser(userId: string): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.unbanUser(userId)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Reset user password (admin action)
 */
export async function resetUserPassword(
    userId: string
): Promise<ServiceResult<{ temporaryPassword: string }>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.resetUserPassword(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Impersonate user (for support purposes)
 */
export async function impersonateUser(userId: string): Promise<ServiceResult<{ token: string }>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.impersonateUser(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

// ============================================================================
// Moderation
// ============================================================================

/**
 * Get moderation action history
 */
export async function getModerationActions(
    userId?: string
): Promise<ServiceResult<ModerationAction[]>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getModerationActions(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get content reports
 */
export async function getContentReports(status?: string): Promise<ServiceResult<ContentReport[]>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getContentReports(status)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Resolve content report
 */
export async function resolveReport(reportId: string, resolution: string): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.resolveReport(reportId, resolution)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Dismiss content report
 */
export async function dismissReport(reportId: string, reason: string): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.dismissReport(reportId, reason)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Delete pixel (moderation action)
 */
export async function deletePixel(x: number, y: number, reason: string): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.deletePixel(x, y, reason)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Restore deleted pixel
 */
export async function restorePixel(x: number, y: number): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.restorePixel(x, y)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

// ============================================================================
// Analytics & Stats
// ============================================================================

/**
 * Get system statistics
 */
export async function getSystemStats(): Promise<ServiceResult<SystemStats>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getSystemStats()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get user analytics
 */
export async function getUserAnalytics(startDate: string, endDate: string) {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getUserAnalytics(startDate, endDate)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(startDate: string, endDate: string) {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getRevenueAnalytics(startDate, endDate)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get canvas analytics
 */
export async function getCanvasAnalytics() {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getCanvasAnalytics()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

// ============================================================================
// Settings Management
// ============================================================================

/**
 * Get system settings
 */
export async function getSettings(): Promise<ServiceResult<Record<string, unknown>>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.getSettings()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Update system settings
 */
export async function updateSettings(settings: Record<string, unknown>): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.updateSettings(settings)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage, errors: apiError.details }
    }
}

/**
 * Clear cache
 */
export async function clearCache(cacheKey?: string): Promise<ServiceResult> {
    try {
        const adminService = createServerAdminService()
        await adminService.clearCache(cacheKey)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Run maintenance task
 */
export async function runMaintenance(
    task: string
): Promise<ServiceResult<{ status: string; message: string }>> {
    try {
        const adminService = createServerAdminService()
        const data = await adminService.runMaintenance(task)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}
