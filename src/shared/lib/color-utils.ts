/**
 * @fileoverview Utility functions for parsing and converting color formats.
 * Client-side only - handles SSR gracefully by checking for browser environment.
 */

import type { Color} from "@/shared/types/fluid-simulation";

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * Parses a CSS color string and returns normalized RGB values (0-1 range).
 * Supports hex, rgb(), rgba(), hsl(), hsla(), oklch(), oklab(), and CSS variables.
 * Uses Canvas 2D context to reliably convert any CSS color to RGB.
 * Returns null if not in browser environment or parsing fails.
 */
export function parseCSSColor(colorString: string): Color | null {
    if (!isBrowser) return null

    // Handle CSS variables by resolving them first
    let resolvedColor = colorString.trim()
    if (resolvedColor.startsWith('var(')) {
        const resolved = resolveCSSVariable(resolvedColor)
        if (!resolved) return null
        resolvedColor = resolved
    }

    // Use canvas to convert any CSS color to RGB
    try {
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        const ctx = canvas.getContext('2d')
        if (!ctx) return null

        // Set the fill style to the color - canvas normalizes any valid CSS color
        ctx.fillStyle = resolvedColor
        ctx.fillRect(0, 0, 1, 1)

        // Get the pixel data (RGBA values 0-255)
        const imageData = ctx.getImageData(0, 0, 1, 1).data

        return {
            r: imageData[0] / 255,
            g: imageData[1] / 255,
            b: imageData[2] / 255,
        }
    } catch {
        return null
    }
}

/**
 * Resolves a CSS variable to its computed color string.
 * Returns null if not in browser environment or resolution fails.
 */
function resolveCSSVariable(varString: string): string | null {
    if (!isBrowser) return null

    const temp = document.createElement('div')
    temp.style.color = varString
    document.body.appendChild(temp)

    const computed = window.getComputedStyle(temp).color
    document.body.removeChild(temp)

    // Return the computed color string (could be rgb, oklch, etc.)
    return computed || null
}

/**
 * Converts a hex color string to normalized RGB values.
 */
export function hexToRGB(hex: string): Color | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        }
        : null
}

/**
 * Creates a color palette from an array of CSS color strings.
 * Returns an array of normalized Color objects.
 * Filters out any colors that fail to parse (e.g., during SSR).
 */
export function createColorPalette(colors: string[]): Color[] {
    return colors
        .map(parseCSSColor)
        .filter((color): color is Color => color !== null)
}
