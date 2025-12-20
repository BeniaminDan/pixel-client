"use server"

import { revalidatePath } from "next/cache"
import {
    getCurrentHolder,
    getThroneStats,
    getLeaderboard,
    getActiveBids,
    getMinimumBid,
    getBattleHistory,
    placeBid,
    getUserBidHistory,
    cancelBid,
} from "@/modules/throne/api/services/throne"

import type { PlaceBidRequest } from "@/services/throne.service"
import type { ServiceResult } from "@/modules/auth"

// ============================================================================
// Public (unauthenticated) actions
// ============================================================================

/**
 * Get current throne holder action
 */
export async function getCurrentHolderAction() {
    return getCurrentHolder()
}

/**
 * Get throne statistics action
 */
export async function getThroneStatsAction() {
    return getThroneStats()
}

/**
 * Get throne leaderboard action
 */
export async function getLeaderboardAction(limit?: number) {
    return getLeaderboard(limit)
}

/**
 * Get active bids action
 */
export async function getActiveBidsAction() {
    return getActiveBids()
}

/**
 * Get minimum bid amount action
 */
export async function getMinimumBidAction() {
    return getMinimumBid()
}

/**
 * Get throne battle history action
 */
export async function getBattleHistoryAction(limit?: number) {
    return getBattleHistory(limit)
}

// ============================================================================
// Authenticated actions
// ============================================================================

/**
 * Place a bid for the throne action
 */
export async function placeBidAction(data: PlaceBidRequest): Promise<ServiceResult<any>> {
    const result = await placeBid(data)

    if (result.success) {
        revalidatePath("/throne")
    }

    return result
}

/**
 * Place bid form action
 */
export async function placeBidFormAction(formData: FormData): Promise<ServiceResult> {
    const amount = parseFloat(formData.get("amount") as string)

    if (isNaN(amount) || amount <= 0) {
        return { success: false, error: "Invalid bid amount" }
    }

    return placeBidAction({ amount })
}

/**
 * Get user's bid history action
 */
export async function getUserBidHistoryAction(userId?: string) {
    return getUserBidHistory(userId)
}

/**
 * Cancel a pending bid action
 */
export async function cancelBidAction(bidId: string): Promise<ServiceResult> {
    const result = await cancelBid(bidId)

    if (result.success) {
        revalidatePath("/throne")
    }

    return result
}
