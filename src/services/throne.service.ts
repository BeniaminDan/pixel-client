/**
 * @fileoverview Throne service for bidding and throne management
 */

import type { AxiosInstance } from 'axios'
import { BaseService } from './base.service'
import { createPublicClient } from '@/lib/api/factory'

export interface ThroneHolder {
  userId: string
  userName: string
  userAvatar?: string
  bidAmount: number
  heldSince: string
  totalDuration: number
  defenses: number
}

export interface ThroneBid {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected' | 'outbid'
  createdAt: string
}

export interface PlaceBidRequest {
  amount: number
}

export interface ThroneStats {
  currentHolder: ThroneHolder | null
  totalBids: number
  highestBid: number
  averageBid: number
  totalRevenue: number
  uniqueBidders: number
}

export interface ThroneLeaderboard {
  holders: Array<{
    userId: string
    userName: string
    userAvatar?: string
    totalDuration: number
    totalBids: number
    totalSpent: number
    rank: number
  }>
  total: number
}

export interface UserThroneHistory {
  userId: string
  totalTimeHeld: number
  totalBids: number
  totalSpent: number
  successfulBids: number
  currentStreak: number
  bids: ThroneBid[]
}

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

// Singleton instance
let throneServiceInstance: ThroneService | null = null

/**
 * Get singleton throne service instance
 */
export function getThroneService(): ThroneService {
  if (!throneServiceInstance) {
    throneServiceInstance = new ThroneService()
  }
  return throneServiceInstance
}
