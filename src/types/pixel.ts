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

// Throne Types
export interface ThroneHolder {
  id: string
  name: string
  avatar: string
  claimedAt: string
  duration: string
  bidAmount: number
}

export interface ThroneBid {
  id: string
  bidderId: string
  bidderName: string
  bidderAvatar: string
  amount: number
  timestamp: string
  status: 'pending' | 'accepted' | 'outbid' | 'expired'
}

export interface ThroneRecord {
  id: string
  holderId: string
  holderName: string
  holderAvatar: string
  startDate: string
  endDate: string
  duration: string
  finalBid: number
}

export interface ThroneStats {
  currentValue: number
  totalChallenges: number
  longestReign: string
  averageReign: string
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

