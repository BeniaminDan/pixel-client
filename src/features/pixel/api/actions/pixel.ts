"use server"

import { revalidatePath } from "next/cache"
import {
    getCanvas,
    getCanvasRegion,
    getPixel,
    getCanvasActivity,
    placePixel,
    bulkPlacePixels,
    getPixelHistory,
    getUserPixelStats,
    getUserPixels,
    exportCanvas,
} from "@/features/pixel/api/services/pixel"

import type { PlacePixelRequest, BulkPlacePixelRequest } from "@/services/pixel.service"
import type { ServiceResult } from "@/features/auth/types"

// ============================================================================
// Public (unauthenticated) actions
// ============================================================================

/**
 * Get entire canvas data action
 */
export async function getCanvasAction() {
    return getCanvas()
}

/**
 * Get canvas region action
 */
export async function getCanvasRegionAction(
    startX: number,
    startY: number,
    endX: number,
    endY: number
) {
    return getCanvasRegion(startX, startY, endX, endY)
}

/**
 * Get specific pixel action
 */
export async function getPixelAction(x: number, y: number) {
    return getPixel(x, y)
}

/**
 * Get canvas activity feed action
 */
export async function getCanvasActivityAction(limit?: number) {
    return getCanvasActivity(limit)
}

// ============================================================================
// Authenticated actions
// ============================================================================

/**
 * Place a single pixel action
 */
export async function placePixelAction(data: PlacePixelRequest): Promise<ServiceResult<any>> {
    const result = await placePixel(data)

    if (result.success) {
        revalidatePath("/canvas")
    }

    return result
}

/**
 * Place pixel form action
 */
export async function placePixelFormAction(formData: FormData): Promise<ServiceResult> {
    const x = parseInt(formData.get("x") as string)
    const y = parseInt(formData.get("y") as string)
    const color = formData.get("color") as string

    if (isNaN(x) || isNaN(y) || !color) {
        return { success: false, error: "Invalid pixel data" }
    }

    return placePixelAction({ x, y, color })
}

/**
 * Place multiple pixels at once action (requires premium)
 */
export async function bulkPlacePixelsAction(
    data: BulkPlacePixelRequest
): Promise<ServiceResult<any>> {
    const result = await bulkPlacePixels(data)

    if (result.success) {
        revalidatePath("/canvas")
    }

    return result
}

/**
 * Get pixel history action
 */
export async function getPixelHistoryAction(x: number, y: number) {
    return getPixelHistory(x, y)
}

/**
 * Get user's pixel statistics action
 */
export async function getUserPixelStatsAction(userId?: string) {
    return getUserPixelStats(userId)
}

/**
 * Get user's placed pixels action
 */
export async function getUserPixelsAction(userId?: string) {
    return getUserPixels(userId)
}

/**
 * Export canvas as image action
 */
export async function exportCanvasAction(format: 'png' | 'jpg' | 'svg' = 'png') {
    return exportCanvas(format)
}
