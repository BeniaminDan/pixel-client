/**
 * @fileoverview Pixel service for canvas and pixel operations
 */

import type { AxiosInstance } from 'axios'
import { BaseService } from './base.service'
import { createPublicClient } from '@/lib/api/factory'

export interface Pixel {
  x: number
  y: number
  color: string
  ownerId: string
  ownerName?: string
  placedAt: string
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

/**
 * Pixel service for canvas operations
 */
export class PixelService extends BaseService {
  /**
   * Get entire canvas data (public endpoint)
   */
  async getCanvas(): Promise<Canvas> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<Canvas>('/canvas')
    return response.data
  }

  /**
   * Get canvas region (public endpoint)
   */
  async getCanvasRegion(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Promise<CanvasRegion> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<CanvasRegion>('/canvas/region', {
      params: { startX, startY, endX, endY },
    })
    return response.data
  }

  /**
   * Get specific pixel (public endpoint)
   */
  async getPixel(x: number, y: number): Promise<Pixel> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<Pixel>(`/pixels/${x}/${y}`)
    return response.data
  }

  /**
   * Place a single pixel (requires authentication)
   */
  async placePixel(data: PlacePixelRequest): Promise<Pixel> {
    const response = await this.client.post<Pixel>('/pixels', data)
    return response.data
  }

  /**
   * Place multiple pixels at once (requires premium)
   */
  async bulkPlacePixels(data: BulkPlacePixelRequest): Promise<Pixel[]> {
    const response = await this.client.post<Pixel[]>('/pixels/bulk', data)
    return response.data
  }

  /**
   * Get pixel history
   */
  async getPixelHistory(x: number, y: number): Promise<PixelHistory[]> {
    const response = await this.client.get<PixelHistory[]>(`/pixels/${x}/${y}/history`)
    return response.data
  }

  /**
   * Get user's pixel statistics
   */
  async getUserPixelStats(userId?: string): Promise<UserPixelStats> {
    const endpoint = userId ? `/users/${userId}/pixels/stats` : '/account/pixels/stats'
    const response = await this.client.get<UserPixelStats>(endpoint)
    return response.data
  }

  /**
   * Get user's placed pixels
   */
  async getUserPixels(userId?: string): Promise<Pixel[]> {
    const endpoint = userId ? `/users/${userId}/pixels` : '/account/pixels'
    const response = await this.client.get<Pixel[]>(endpoint)
    return response.data
  }

  /**
   * Export canvas as image
   */
  async exportCanvas(format: 'png' | 'jpg' | 'svg' = 'png'): Promise<Blob> {
    const response = await this.client.get(`/canvas/export`, {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  }

  /**
   * Get canvas activity feed (recent placements)
   */
  async getCanvasActivity(limit = 50): Promise<PixelHistory[]> {
    const publicClient = createPublicClient()
    const response = await publicClient.get<PixelHistory[]>('/canvas/activity', {
      params: { limit },
    })
    return response.data
  }
}

// Singleton instance
let pixelServiceInstance: PixelService | null = null

/**
 * Get singleton pixel service instance
 */
export function getPixelService(): PixelService {
  if (!pixelServiceInstance) {
    pixelServiceInstance = new PixelService()
  }
  return pixelServiceInstance
}
