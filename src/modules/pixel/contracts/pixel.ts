/**
 * @fileoverview Types for Pixel canvas, throne, and pricing data models.
 */

// Canvas Types
export interface Pixel {
  x: number
  y: number
  color: string
  ownerId: string
  ownerName: string
  placedAt: string
  zone: number
}

export interface PixelActivity {
  id: string
  x: number
  y: number
  color: string
  ownerName: string
  timestamp: string
}

export interface CanvasStats {
  totalPixels: number
  claimedPixels: number
  activeUsers: number
  pixelsClaimedToday: number
}

export interface CanvasViewport {
  x: number
  y: number
  zoom: number
}

// Pricing Types
export interface PricingPackage {
  id: string
  name: string
  credits: number
  price: number
  pricePerCredit: number
  popular?: boolean
  features: string[]
}

export interface ZonePricing {
  zone: number
  name: string
  baseMultiplier: number
  competitionLevel: 'extreme' | 'high' | 'medium' | 'low'
  description: string
}

// Gallery Types
export interface GalleryCreation {
  id: string
  title: string
  creatorId: string
  creatorName: string
  creatorAvatar: string
  thumbnail: string
  location: { x: number; y: number }
  pixelCount: number
  createdAt: string
  likes: number
  featured?: boolean
}

export interface ThroneBattle {
  id: string
  challengerId: string
  challengerName: string
  challengerAvatar: string
  defenderId: string
  defenderName: string
  defenderAvatar: string
  bidAmount: number
  timestamp: string
  outcome: 'challenger_won' | 'defender_held'
}

// Stats Types
export interface LiveStats {
  pixelsClaimedToday: number
  activeUsersNow: number
  throneValue: number
  throneChallenges: number
  totalPixelsOwned: number
  totalDollarsSpent: number
}


export interface PlacePixelRequest {
  x: number
  y: number
  color: string
}

export interface BulkPlacePixelRequest {
  pixels: Array<{
    x: number
    y: number
    color: string
  }>
}

export interface Canvas {
  width: number
  height: number
  pixels: Pixel[]
  totalPixels: number
  placedPixels: number
  lastUpdate: string
}

export interface CanvasRegion {
  startX: number
  startY: number
  endX: number
  endY: number
  pixels: Pixel[]
}

export interface PixelHistory {
  pixelId: string
  x: number
  y: number
  color: string
  previousColor?: string
  ownerId: string
  ownerName?: string
  placedAt: string
}

export interface UserPixelStats {
  userId: string
  totalPixels: number
  activePixels: number
  recentPixels: Pixel[]
}


