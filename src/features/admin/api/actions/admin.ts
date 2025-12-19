"use server"

import { revalidatePath } from "next/cache"
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    banUser,
    unbanUser,
    resetUserPassword,
    impersonateUser,
    getModerationActions,
    getContentReports,
    resolveReport,
    dismissReport,
    deletePixel,
    restorePixel,
    getSystemStats,
    getUserAnalytics,
    getRevenueAnalytics,
    getCanvasAnalytics,
    getSettings,
    updateSettings,
    clearCache,
    runMaintenance,
} from "@/features/admin/api/services/admin"

import type {
    UserListQuery,
    UpdateUserRequest,
    BanUserRequest,
} from "@/services/admin.service"
import type { ServiceResult } from "@/features/auth/types"

// ============================================================================
// User Management Actions
// ============================================================================

/**
 * Get list of users action
 */
export async function getUsersAction(query?: UserListQuery) {
    return getUsers(query)
}

/**
 * Get single user action
 */
export async function getUserAction(userId: string) {
    return getUser(userId)
}

/**
 * Update user action
 */
export async function updateUserAction(
    userId: string,
    data: UpdateUserRequest
): Promise<ServiceResult<any>> {
    const result = await updateUser(userId, data)

    if (result.success) {
        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
    }

    return result
}

/**
 * Delete user action
 */
export async function deleteUserAction(userId: string): Promise<ServiceResult> {
    const result = await deleteUser(userId)

    if (result.success) {
        revalidatePath("/admin/users")
    }

    return result
}

/**
 * Ban user action
 */
export async function banUserAction(userId: string, data: BanUserRequest): Promise<ServiceResult> {
    const result = await banUser(userId, data)

    if (result.success) {
        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
    }

    return result
}

/**
 * Unban user action
 */
export async function unbanUserAction(userId: string): Promise<ServiceResult> {
    const result = await unbanUser(userId)

    if (result.success) {
        revalidatePath("/admin/users")
        revalidatePath(`/admin/users/${userId}`)
    }

    return result
}

/**
 * Reset user password action
 */
export async function resetUserPasswordAction(userId: string) {
    return resetUserPassword(userId)
}

/**
 * Impersonate user action
 */
export async function impersonateUserAction(userId: string) {
    return impersonateUser(userId)
}

// ============================================================================
// Moderation Actions
// ============================================================================

/**
 * Get moderation actions action
 */
export async function getModerationActionsAction(userId?: string) {
    return getModerationActions(userId)
}

/**
 * Get content reports action
 */
export async function getContentReportsAction(status?: string) {
    return getContentReports(status)
}

/**
 * Resolve report action
 */
export async function resolveReportAction(
    reportId: string,
    resolution: string
): Promise<ServiceResult> {
    const result = await resolveReport(reportId, resolution)

    if (result.success) {
        revalidatePath("/admin/moderation")
    }

    return result
}

/**
 * Dismiss report action
 */
export async function dismissReportAction(reportId: string, reason: string): Promise<ServiceResult> {
    const result = await dismissReport(reportId, reason)

    if (result.success) {
        revalidatePath("/admin/moderation")
    }

    return result
}

/**
 * Delete pixel action
 */
export async function deletePixelAction(
    x: number,
    y: number,
    reason: string
): Promise<ServiceResult> {
    const result = await deletePixel(x, y, reason)

    if (result.success) {
        revalidatePath("/canvas")
        revalidatePath("/admin/moderation")
    }

    return result
}

/**
 * Restore pixel action
 */
export async function restorePixelAction(x: number, y: number): Promise<ServiceResult> {
    const result = await restorePixel(x, y)

    if (result.success) {
        revalidatePath("/canvas")
        revalidatePath("/admin/moderation")
    }

    return result
}

// ============================================================================
// Analytics & Stats Actions
// ============================================================================

/**
 * Get system statistics action
 */
export async function getSystemStatsAction() {
    return getSystemStats()
}

/**
 * Get user analytics action
 */
export async function getUserAnalyticsAction(startDate: string, endDate: string) {
    return getUserAnalytics(startDate, endDate)
}

/**
 * Get revenue analytics action
 */
export async function getRevenueAnalyticsAction(startDate: string, endDate: string) {
    return getRevenueAnalytics(startDate, endDate)
}

/**
 * Get canvas analytics action
 */
export async function getCanvasAnalyticsAction() {
    return getCanvasAnalytics()
}

// ============================================================================
// Settings Actions
// ============================================================================

/**
 * Get settings action
 */
export async function getSettingsAction() {
    return getSettings()
}

/**
 * Update settings action
 */
export async function updateSettingsAction(
    settings: Record<string, unknown>
): Promise<ServiceResult> {
    const result = await updateSettings(settings)

    if (result.success) {
        revalidatePath("/admin/settings")
    }

    return result
}

/**
 * Clear cache action
 */
export async function clearCacheAction(cacheKey?: string): Promise<ServiceResult> {
    return clearCache(cacheKey)
}

/**
 * Run maintenance action
 */
export async function runMaintenanceAction(task: string) {
    return runMaintenance(task)
}
