/**
 * @fileoverview Zustand store for canvas state with simulated real-time updates.
 */

import { create } from 'zustand'
import type { Pixel, PixelActivity, CanvasStats, CanvasViewport } from '@/types'

// Mock color palette for simulated activity
const MOCK_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
]

const MOCK_NAMES = [
  'PixelMaster', 'ArtCreator', 'ColorKing', 'CanvasQueen', 'PixelNinja',
  'DigitalArtist', 'CreativeGenius', 'PixelPro', 'ArtWizard', 'ColorChamp',
]

// Generate mock pixels for the canvas
function generateMockPixels(): Map<string, Pixel> {
  const pixels = new Map<string, Pixel>()

  // Generate some random claimed pixels
  for (let i = 0; i < 500; i++) {
    const x = Math.floor(Math.random() * 1000) - 500
    const y = Math.floor(Math.random() * 1000) - 500
    const key = `${x},${y}`

    // Calculate zone based on distance from center
    const distance = Math.sqrt(x * x + y * y)
    const zone = distance < 50 ? 0 : distance < 150 ? 1 : distance < 300 ? 2 : 3

    pixels.set(key, {
      x,
      y,
      color: MOCK_COLORS[Math.floor(Math.random() * MOCK_COLORS.length)],
      ownerId: `user-${Math.floor(Math.random() * 100)}`,
      ownerName: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      placedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      zone,
    })
  }

  // Ensure focal point area has some pixels
  for (let x = -5; x <= 5; x++) {
    for (let y = -5; y <= 5; y++) {
      const key = `${x},${y}`
      if (!pixels.has(key) && Math.random() > 0.3) {
        pixels.set(key, {
          x,
          y,
          color: MOCK_COLORS[Math.floor(Math.random() * MOCK_COLORS.length)],
          ownerId: `user-${Math.floor(Math.random() * 100)}`,
          ownerName: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
          placedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          zone: 0,
        })
      }
    }
  }

  return pixels
}

interface CanvasState {
  pixels: Map<string, Pixel>
  recentActivity: PixelActivity[]
  stats: CanvasStats
  viewport: CanvasViewport
  selectedPixel: Pixel | null
  isLoading: boolean

  // Actions
  setViewport: (viewport: Partial<CanvasViewport>) => void
  selectPixel: (pixel: Pixel | null) => void
  jumpToFocalPoint: () => void
  addActivity: (activity: PixelActivity) => void
  startSimulation: () => () => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  pixels: generateMockPixels(),
  recentActivity: [],
  stats: {
    totalPixels: 1000000,
    claimedPixels: 52847,
    activeUsers: 127,
    pixelsClaimedToday: 423,
  },
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedPixel: null,
  isLoading: false,

  setViewport: (viewport) =>
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    })),

  selectPixel: (pixel) => set({ selectedPixel: pixel }),

  jumpToFocalPoint: () =>
    set({
      viewport: { x: 0, y: 0, zoom: 2 },
    }),

  addActivity: (activity) =>
    set((state) => ({
      recentActivity: [activity, ...state.recentActivity].slice(0, 50),
    })),

  startSimulation: () => {
    // Simulate real-time pixel updates
    const interval = setInterval(() => {
      const state = get()
      const x = Math.floor(Math.random() * 200) - 100
      const y = Math.floor(Math.random() * 200) - 100
      const color = MOCK_COLORS[Math.floor(Math.random() * MOCK_COLORS.length)]
      const ownerName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)]

      const activity: PixelActivity = {
        id: `activity-${Date.now()}`,
        x,
        y,
        color,
        ownerName,
        timestamp: new Date().toISOString(),
      }

      const distance = Math.sqrt(x * x + y * y)
      const zone = distance < 50 ? 0 : distance < 150 ? 1 : distance < 300 ? 2 : 3

      const newPixel: Pixel = {
        x,
        y,
        color,
        ownerId: `user-${Math.floor(Math.random() * 100)}`,
        ownerName,
        placedAt: new Date().toISOString(),
        zone,
      }

      const newPixels = new Map(state.pixels)
      newPixels.set(`${x},${y}`, newPixel)

      set({
        pixels: newPixels,
        recentActivity: [activity, ...state.recentActivity].slice(0, 50),
        stats: {
          ...state.stats,
          claimedPixels: state.stats.claimedPixels + 1,
          pixelsClaimedToday: state.stats.pixelsClaimedToday + 1,
        },
      })
    }, 2000 + Math.random() * 3000)

    // Return cleanup function
    return () => clearInterval(interval)
  },
}))

