/**
 * @fileoverview Zustand store for Throne (Focal Point) state with simulated updates.
 */

import { create } from 'zustand'
import type { ThroneHolder, ThroneBid, ThroneRecord, ThroneStats } from '@/types'

// Mock data for throne history
const MOCK_THRONE_RECORDS: ThroneRecord[] = [
  {
    id: 'record-1',
    holderId: 'user-42',
    holderName: 'PixelKing',
    holderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelKing',
    startDate: '2024-12-01T10:00:00Z',
    endDate: '2024-12-05T14:30:00Z',
    duration: '4d 4h 30m',
    finalBid: 2500,
  },
  {
    id: 'record-2',
    holderId: 'user-17',
    holderName: 'ArtLegend',
    holderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArtLegend',
    startDate: '2024-12-05T14:30:00Z',
    endDate: '2024-12-10T09:15:00Z',
    duration: '4d 18h 45m',
    finalBid: 3200,
  },
  {
    id: 'record-3',
    holderId: 'user-89',
    holderName: 'CanvasChamp',
    holderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CanvasChamp',
    startDate: '2024-12-10T09:15:00Z',
    endDate: '2024-12-14T16:00:00Z',
    duration: '4d 6h 45m',
    finalBid: 4100,
  },
]

const MOCK_BIDS: ThroneBid[] = [
  {
    id: 'bid-1',
    bidderId: 'user-23',
    bidderName: 'PixelNinja',
    bidderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelNinja',
    amount: 5800,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'outbid',
  },
  {
    id: 'bid-2',
    bidderId: 'user-56',
    bidderName: 'ColorMaster',
    bidderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ColorMaster',
    amount: 6200,
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'outbid',
  },
  {
    id: 'bid-3',
    bidderId: 'user-78',
    bidderName: 'CryptoArtist',
    bidderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoArtist',
    amount: 6500,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'pending',
  },
]

interface ThroneState {
  currentHolder: ThroneHolder
  recentBids: ThroneBid[]
  hallOfFame: ThroneRecord[]
  stats: ThroneStats
  isChallengePeriod: boolean
  gracePeriodEnds: string | null

  // Actions
  placeBid: (amount: number, bidderName: string) => void
  startSimulation: () => () => void
}

export const useThroneStore = create<ThroneState>((set, get) => ({
  currentHolder: {
    id: 'user-101',
    name: 'ThroneDefender',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThroneDefender',
    claimedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '3d 2h 15m',
    bidAmount: 6500,
  },
  recentBids: MOCK_BIDS,
  hallOfFame: MOCK_THRONE_RECORDS,
  stats: {
    currentValue: 6500,
    totalChallenges: 247,
    longestReign: '12d 8h 30m',
    averageReign: '4d 10h',
  },
  isChallengePeriod: true,
  gracePeriodEnds: null,

  placeBid: (amount, bidderName) => {
    const state = get()
    const newBid: ThroneBid = {
      id: `bid-${Date.now()}`,
      bidderId: `user-${Math.floor(Math.random() * 1000)}`,
      bidderName,
      bidderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${bidderName}`,
      amount,
      timestamp: new Date().toISOString(),
      status: 'pending',
    }

    set({
      recentBids: [newBid, ...state.recentBids].slice(0, 20),
      stats: {
        ...state.stats,
        currentValue: amount,
        totalChallenges: state.stats.totalChallenges + 1,
      },
    })
  },

  startSimulation: () => {
    // Update duration every minute
    const durationInterval = setInterval(() => {
      const state = get()
      const claimedAt = new Date(state.currentHolder.claimedAt)
      const now = new Date()
      const diff = now.getTime() - claimedAt.getTime()

      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))

      set({
        currentHolder: {
          ...state.currentHolder,
          duration: `${days}d ${hours}h ${minutes}m`,
        },
      })
    }, 60000)

    // Simulate occasional bids (every 30-90 seconds)
    const bidInterval = setInterval(() => {
      const state = get()
      const shouldBid = Math.random() > 0.7 // 30% chance

      if (shouldBid) {
        const names = ['PixelWarrior', 'ArtChallenger', 'ThroneSeeker', 'CanvasBoss', 'PixelLord']
        const bidderName = names[Math.floor(Math.random() * names.length)]
        const minBid = Math.ceil(state.stats.currentValue * 1.2)
        const maxBid = Math.ceil(state.stats.currentValue * 1.5)
        const amount = Math.floor(Math.random() * (maxBid - minBid) + minBid)

        const newBid: ThroneBid = {
          id: `bid-${Date.now()}`,
          bidderId: `user-${Math.floor(Math.random() * 1000)}`,
          bidderName,
          bidderAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${bidderName}`,
          amount,
          timestamp: new Date().toISOString(),
          status: 'pending',
        }

        // Mark previous pending bids as outbid
        const updatedBids = state.recentBids.map((bid) =>
          bid.status === 'pending' ? { ...bid, status: 'outbid' as const } : bid
        )

        set({
          recentBids: [newBid, ...updatedBids].slice(0, 20),
          stats: {
            ...state.stats,
            currentValue: amount,
            totalChallenges: state.stats.totalChallenges + 1,
          },
        })
      }
    }, 30000 + Math.random() * 60000)

    return () => {
      clearInterval(durationInterval)
      clearInterval(bidInterval)
    }
  },
}))

