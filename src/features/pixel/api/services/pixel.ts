/**
 * @fileoverview Pixel service layer for server actions
 * All functions in this service are designed to be called from server actions.
 */

import type { ServiceResult } from "@/features/auth/types"
import { PixelService } from "@/services/pixel.service"
import { createAuthenticatedClient, createPublicClient } from "@/lib/api/factory"
import { attachAuthInterceptor, createServerTokenGetter } from "@/lib/api/interceptors"
import { handleApiErrorSilently } from "@/lib/api/errors"
import type {
    Pixel,
    PlacePixelRequest,
    BulkPlacePixelRequest,
    Canvas,
    CanvasRegion,
    PixelHistory,
    UserPixelStats,
} from "@/services/pixel.service"

/**
 * Create server-side authenticated client with token getter and refresh
 */
function createServerAuthenticatedClient() {
    const client = createAuthenticatedClient()
    attachAuthInterceptor(client, {
        getToken: createServerTokenGetter(),
        refreshToken: async () => {
            const { refreshServerAccessToken } = await import('@/features/auth/lib/auth')
            return refreshServerAccessToken()
        },
        autoRefresh: true,
    })
    return client
}

/**
 * Create server-side pixel service
 */
function createServerPixelService() {
    return new PixelService(createServerAuthenticatedClient())
}

// ============================================================================
// Public (unauthenticated) endpoints
// ============================================================================

/**
 * Get entire canvas data
 */
export async function getCanvas(): Promise<ServiceResult<Canvas>> {
    try {
        const pixelService = new PixelService(createPublicClient())
        const data = await pixelService.getCanvas()
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get canvas region
 */
export async function getCanvasRegion(
    startX: number,
    startY: number,
    endX: number,
    endY: number
): Promise<ServiceResult<CanvasRegion>> {
    try {
        const pixelService = new PixelService(createPublicClient())
        const data = await pixelService.getCanvasRegion(startX, startY, endX, endY)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get specific pixel
 */
export async function getPixel(x: number, y: number): Promise<ServiceResult<Pixel>> {
    try {
        const pixelService = new PixelService(createPublicClient())
        const data = await pixelService.getPixel(x, y)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get canvas activity feed
 */
export async function getCanvasActivity(limit?: number): Promise<ServiceResult<PixelHistory[]>> {
    try {
        const pixelService = new PixelService(createPublicClient())
        const data = await pixelService.getCanvasActivity(limit)
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
 * Place a single pixel
 */
export async function placePixel(data: PlacePixelRequest): Promise<ServiceResult<Pixel>> {
    try {
        const pixelService = createServerPixelService()
        const pixel = await pixelService.placePixel(data)
        return { success: true, data: pixel }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage, errors: apiError.details }
    }
}

/**
 * Place multiple pixels at once (requires premium)
 */
export async function bulkPlacePixels(data: BulkPlacePixelRequest): Promise<ServiceResult<Pixel[]>> {
    try {
        const pixelService = createServerPixelService()
        const pixels = await pixelService.bulkPlacePixels(data)
        return { success: true, data: pixels }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage, errors: apiError.details }
    }
}

/**
 * Get pixel history
 */
export async function getPixelHistory(x: number, y: number): Promise<ServiceResult<PixelHistory[]>> {
    try {
        const pixelService = createServerPixelService()
        const data = await pixelService.getPixelHistory(x, y)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get user's pixel statistics
 */
export async function getUserPixelStats(userId?: string): Promise<ServiceResult<UserPixelStats>> {
    try {
        const pixelService = createServerPixelService()
        const data = await pixelService.getUserPixelStats(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Get user's placed pixels
 */
export async function getUserPixels(userId?: string): Promise<ServiceResult<Pixel[]>> {
    try {
        const pixelService = createServerPixelService()
        const data = await pixelService.getUserPixels(userId)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}

/**
 * Export canvas as image
 */
export async function exportCanvas(format: 'png' | 'jpg' | 'svg' = 'png'): Promise<ServiceResult<Blob>> {
    try {
        const pixelService = createServerPixelService()
        const data = await pixelService.exportCanvas(format)
        return { success: true, data }
    } catch (error) {
        const apiError = handleApiErrorSilently(error)
        return { success: false, error: apiError.userMessage }
    }
}
