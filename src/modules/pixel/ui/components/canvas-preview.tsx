"use client"

import {useCallback, useEffect, useRef} from "react"
import {motion} from "motion/react"
import {Sparkles, Target, Users} from "lucide-react"

import { useCanvasStore } from "@/modules/pixel"
import {Button} from "@/shared/ui/reusable/button"
import {Badge} from "@/shared/ui/reusable/badge"

interface CanvasPreviewProps {
  className?: string
  showControls?: boolean
  autoSimulate?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: { width: 200, height: 150, pixelSize: 4 },
  md: { width: 300, height: 225, pixelSize: 6 },
  lg: { width: 400, height: 300, pixelSize: 8 },
}

export function CanvasPreview({
  className = "",
  showControls = true,
  autoSimulate = true,
  size = "md",
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { pixels, stats, viewport, jumpToFocalPoint, startSimulation } = useCanvasStore()
  const config = sizeConfig[size]

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with dark background
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, config.width, config.height)

    // Draw grid lines (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 0.5
    for (let x = 0; x < config.width; x += config.pixelSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, config.height)
      ctx.stroke()
    }
    for (let y = 0; y < config.height; y += config.pixelSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(config.width, y)
      ctx.stroke()
    }

    // Calculate visible area based on viewport
    const centerX = config.width / 2
    const centerY = config.height / 2
    // const visibleRange = Math.floor(config.width / config.pixelSize / viewport.zoom / 2)

    // Draw pixels
    pixels.forEach((pixel) => {
      const screenX = centerX + (pixel.x - viewport.x) * config.pixelSize * viewport.zoom
      const screenY = centerY + (pixel.y - viewport.y) * config.pixelSize * viewport.zoom

      if (
        screenX >= -config.pixelSize &&
        screenX < config.width + config.pixelSize &&
        screenY >= -config.pixelSize &&
        screenY < config.height + config.pixelSize
      ) {
        ctx.fillStyle = pixel.color
        ctx.fillRect(
          screenX - (config.pixelSize * viewport.zoom) / 2,
          screenY - (config.pixelSize * viewport.zoom) / 2,
          config.pixelSize * viewport.zoom,
          config.pixelSize * viewport.zoom
        )
      }
    })

    // Draw focal point indicator (0,0)
    const focalX = centerX - viewport.x * config.pixelSize * viewport.zoom
    const focalY = centerY - viewport.y * config.pixelSize * viewport.zoom

    // Pulsing glow effect for focal point
    const gradient = ctx.createRadialGradient(focalX, focalY, 0, focalX, focalY, 20 * viewport.zoom)
    gradient.addColorStop(0, "rgba(255, 107, 107, 0.8)")
    gradient.addColorStop(0.5, "rgba(255, 107, 107, 0.3)")
    gradient.addColorStop(1, "rgba(255, 107, 107, 0)")
    ctx.fillStyle = gradient
    ctx.fillRect(focalX - 25 * viewport.zoom, focalY - 25 * viewport.zoom, 50 * viewport.zoom, 50 * viewport.zoom)

    // Draw crosshair at focal point
    ctx.strokeStyle = "rgba(255, 107, 107, 0.6)"
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(focalX - 15, focalY)
    ctx.lineTo(focalX + 15, focalY)
    ctx.moveTo(focalX, focalY - 15)
    ctx.lineTo(focalX, focalY + 15)
    ctx.stroke()
    ctx.setLineDash([])
  }, [pixels, viewport, config])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  useEffect(() => {
    if (autoSimulate) {
      return startSimulation()
    }
  }, [autoSimulate, startSimulation])

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={config.width}
        height={config.height}
        className="block"
      />

      {/* Live indicator */}
      <div className="absolute top-3 left-3">
        <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Live
        </Badge>
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3" />
            {stats.claimedPixels.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {stats.activeUsers}
          </span>
        </div>

        {showControls && (
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
            onClick={jumpToFocalPoint}
          >
            <Target className="size-3 mr-1" />
            0,0
          </Button>
        )}
      </div>
    </motion.div>
  )
}
