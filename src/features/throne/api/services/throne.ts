/**
 * @fileoverview Throne service layer for server actions
 * All functions in this service are designed to be called from server actions.
 */

import type { ServiceResult } from "@/features/auth/types"
import { ThroneService } from "@/services/throne.service"
import { createAuthenticatedClient, createPublicClient } from "@/lib/api/factory"
import { attachAuthInterceptor, createServerTokenGetter } from "@/lib/api/interceptors"
import { handleApiErrorSilently } from "@/lib/api/errors"
import type {
    ThroneHolder,
    ThroneBid,
    PlaceBidRequest,
    ThroneStats,
    ThroneLeaderboard,
    UserThroneHistory,
} from "@/services/throne.service"

/**
 * Create server-side authenticated client with token getter and refresh
 */
function createServerAuthenticatedClient() {
    const client = createAuthenticatedClient()
    attachAuthInterceptor(client, {
        getToken: createServerTokenGetter(),
        refreshToken: async () => {
            const { refreshServerAccessToken } = await import('@/lib/auth')
            return refreshServerAccessToken()
        },
        autoRefresh: true,
    })
    return client
}

/**
 * Create server-side throne service
 */
function createServerThroneService() {
    return new ThroneService(createServerAuthenticatedClient())
}

// ============================================================================
// Public (unauthenticated) endpoints
// ============================================================================

/**
 * Get current throne holder
 */
export async function getCurrentHolder(): Promise<ServiceResult<ThroneHolder | null>> {
    try {
        const throneService = new ThroneService(createPublicClient())
        const data = await throneService.getCurrentHolder()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get throne statistics
 */
export async function getThroneStats(): Promise<ServiceResult<ThroneStats>> {
    try {
        const throneService = new ThroneService(createPublicClient())
        const data = await throneService.getThroneStats()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get throne leaderboard
 */
export async function getLeaderboard(limit?: number): Promise<ServiceResult<ThroneLeaderboard>> {
    try {
        const throneService = new ThroneService(createPublicClient())
        const data = await throneService.getLeaderboard(limit)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get active bids
 */
export async function getActiveBids(): Promise<ServiceResult<ThroneBid[]>> {
    try {
        const throneService = new ThroneService(createPublicClient())
        const data = await throneService.getActiveBids()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get minimum bid amount
 */
export async function getMinimumBid(): Promise<ServiceResult<{ amount: number }>> {
    try {
        const throneService = new ThroneService(createPublicClient())
        const data = await throneService.getMinimumBid()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get throne battle history
 */
export async function getBattleHistory(limit?: number): Promise<ServiceResult<ThroneBid[]>> {
    try {
        const throneService = new ThroneService(createPublicClient())
        const data = await throneService.getBattleHistory(limit)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

// ============================================================================
// Authenticated endpoints
// ============================================================================

/**
 * Place a bid for the throne
 */
export async function placeBid(data: PlaceBidRequest): Promise<ServiceResult<ThroneBid>> {
    try {
        const throneService = createServerThroneService()
        const bid = await throneService.placeBid(data)
        return { success: true, data: bid }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage, errors: apiError.details }
    }
}

/**
 * Get user's bid history
 */
export async function getUserBidHistory(userId?: string): Promise<ServiceResult<UserThroneHistory>> {
    try {
        const throneService = createServerThroneService()
        const data = await throneService.getUserBidHistory(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Cancel a pending bid
 */
export async function cancelBid(bidId: string): Promise<ServiceResult> {
    try {
        const throneService = createServerThroneService()
        await throneService.cancelBid(bidId)
        return { success: true }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}
