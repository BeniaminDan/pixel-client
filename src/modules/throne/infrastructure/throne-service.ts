/**
 * @fileoverview Throne service for bidding and throne management
 */

import { BaseService } from "@/server/http/infrastructure";
import { createPublicClient } from "@/server/http/infrastructure";
import {
  PlaceBidRequest,
  ThroneBid,
  ThroneHolder,
  ThroneLeaderboard,
  ThroneStats,
  UserThroneHistory
} from "@/modules/throne/contracts/throne";

/**
 * Throne service for the focal point competition
 */
export class ThroneService extends BaseService {
  /**
   * Get current throne holder (public)
   */
  async getCurrentHolder(): Promise<ThroneHolder | null> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<ThroneHolder | null>('/throne/current')
    return response.data
  }

  /**
   * Get throne statistics (public)
   */
  async getThroneStats(): Promise<ThroneStats> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<ThroneStats>('/throne/stats')
    return response.data
  }

  /**
   * Get throne leaderboard (public)
   */
  async getLeaderboard(limit = 100): Promise<ThroneLeaderboard> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<ThroneLeaderboard>('/throne/leaderboard', {
      params: { limit },
    })
    return response.data
  }

  /**
   * Place a bid for the throne (requires authentication)
   */
  async placeBid(data: PlaceBidRequest): Promise<ThroneBid> {
    const response = await this.client.post<ThroneBid>('/throne/bid', data)
    return response.data
  }

  /**
   * Get user's bid history
   */
  async getUserBidHistory(userId?: string): Promise<UserThroneHistory> {
    const endpoint = userId ? `/users/${userId}/throne/history` : '/account/throne/history'
    const response = await this.client.get<UserThroneHistory>(endpoint)
    return response.data
  }

  /**
   * Get active bids
   */
  async getActiveBids(): Promise<ThroneBid[]> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<ThroneBid[]>('/throne/bids/active')
    return response.data
  }

  /**
   * Cancel a pending bid
   */
  async cancelBid(bidId: string): Promise<void> {
    await this.client.delete(`/throne/bids/${bidId}`)
  }

  /**
   * Get minimum bid amount
   */
  async getMinimumBid(): Promise<{ amount: number }> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<{ amount: number }>('/throne/minimum-bid')
    return response.data
  }

  /**
   * Get throne battle history
   */
  async getBattleHistory(limit = 50): Promise<ThroneBid[]> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<ThroneBid[]>('/throne/battles', {
      params: { limit },
    })
    return response.data
  }
}
