/**
 * @fileoverview Zustand store for live statistics with simulated real-time updates.
 */

import { create } from 'zustand'
import type { LiveStatsType } from "@/modules/pixel";

interface StatsState {
  stats: LiveStatsType
  isLoading: boolean
  lastUpdated: string

  // Actions
  updateStats: (partial: Partial<LiveStatsType>) => void
  startSimulation: () => () => void
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: {
    pixelsClaimedToday: 1247,
    activeUsersNow: 89,
    throneValue: 6500,
    throneChallenges: 12,
    totalPixelsOwned: 52847,
    totalDollarsSpent: 128450,
  },
  isLoading: false,
  lastUpdated: new Date().toISOString(),

  updateStats: (partial) =>
    set((state) => ({
      stats: { ...state.stats, ...partial },
      lastUpdated: new Date().toISOString(),
    })),

  startSimulation: () => {
    // Simulate stats updates every 3-8 seconds
    const interval = setInterval(() => {
      const state = get()
      const updates: Partial<LiveStatsType> = {}

      // Random chance to update each stat
      if (Math.random() > 0.5) {
        updates.pixelsClaimedToday = state.stats.pixelsClaimedToday + Math.floor(Math.random() * 3) + 1
        updates.totalPixelsOwned = state.stats.totalPixelsOwned + (updates.pixelsClaimedToday - state.stats.pixelsClaimedToday)
      }

      if (Math.random() > 0.6) {
        // Active users fluctuates
        const change = Math.floor(Math.random() * 10) - 4
        updates.activeUsersNow = Math.max(50, state.stats.activeUsersNow + change)
      }

      if (Math.random() > 0.9) {
        // Throne challenges are rare
        updates.throneChallenges = state.stats.throneChallenges + 1
      }

      if (Math.random() > 0.7) {
        // Dollars spent increases
        updates.totalDollarsSpent = state.stats.totalDollarsSpent + Math.floor(Math.random() * 50) + 5
      }

      if (Object.keys(updates).length > 0) {
        set({
          stats: { ...state.stats, ...updates },
          lastUpdated: new Date().toISOString(),
        })
      }
    }, 3000 + Math.random() * 5000)

    return () => clearInterval(interval)
  },
}))

