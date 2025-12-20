"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {AnimatePresence, motion} from "motion/react"
import {Calendar, MapPin, Search, Target, User, X, ZoomIn, ZoomOut,} from "lucide-react"

import { useCanvasStore } from "@/modules/pixel";
import { Button } from "@/shared/ui/reusable/button"
import { Input } from "@/shared/ui/reusable/input"
import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import type { Pixel } from "@/modules/pixel";

interface CanvasViewerProps {
  className?: string
  showControls?: boolean
  autoSimulate?: boolean
}

export function CanvasViewer({
  className = "",
  showControls = true,
  autoSimulate = true,
}: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showSearch, setShowSearch] = useState(false)
  const [searchCoords, setSearchCoords] = useState("")
  const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  const {
    pixels,
    stats,
    viewport,
    selectedPixel,
    setViewport,
    selectPixel,
    jumpToFocalPoint,
    startSimulation,
  } = useCanvasStore()

  const PIXEL_SIZE = 10

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
    ctx.lineWidth = 0.5
    const gridStep = PIXEL_SIZE * viewport.zoom

    const startX = (canvasSize.width / 2 - viewport.x * PIXEL_SIZE * viewport.zoom) % gridStep
    const startY = (canvasSize.height / 2 - viewport.y * PIXEL_SIZE * viewport.zoom) % gridStep

    for (let x = startX; x < canvasSize.width; x += gridStep) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasSize.height)
      ctx.stroke()
    }
    for (let y = startY; y < canvasSize.height; y += gridStep) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasSize.width, y)
      ctx.stroke()
    }

    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2

    // Draw pixels
    pixels.forEach((pixel) => {
      const screenX = centerX + (pixel.x - viewport.x) * PIXEL_SIZE * viewport.zoom
      const screenY = centerY + (pixel.y - viewport.y) * PIXEL_SIZE * viewport.zoom
      const size = PIXEL_SIZE * viewport.zoom

      if (
        screenX >= -size &&
        screenX < canvasSize.width + size &&
        screenY >= -size &&
        screenY < canvasSize.height + size
      ) {
        ctx.fillStyle = pixel.color
        ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size)

        // Draw border for selected pixel
        if (selectedPixel && selectedPixel.x === pixel.x && selectedPixel.y === pixel.y) {
          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 2
          ctx.strokeRect(screenX - size / 2 - 1, screenY - size / 2 - 1, size + 2, size + 2)
        }
      }
    })

    // Draw zone rings
    const zones = [
      { radius: 50, color: "rgba(255, 107, 107, 0.1)" },
      { radius: 150, color: "rgba(255, 193, 7, 0.05)" },
      { radius: 300, color: "rgba(76, 175, 80, 0.03)" },
    ]

    zones.forEach(({ radius, color }) => {
      const screenRadius = radius * PIXEL_SIZE * viewport.zoom
      const focalX = centerX - viewport.x * PIXEL_SIZE * viewport.zoom
      const focalY = centerY - viewport.y * PIXEL_SIZE * viewport.zoom

      ctx.beginPath()
      ctx.arc(focalX, focalY, screenRadius, 0, Math.PI * 2)
      ctx.strokeStyle = color.replace("0.1", "0.3").replace("0.05", "0.2").replace("0.03", "0.1")
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw focal point marker
    const focalX = centerX - viewport.x * PIXEL_SIZE * viewport.zoom
    const focalY = centerY - viewport.y * PIXEL_SIZE * viewport.zoom

    // Glow effect
    const gradient = ctx.createRadialGradient(focalX, focalY, 0, focalX, focalY, 30)
    gradient.addColorStop(0, "rgba(255, 107, 107, 0.6)")
    gradient.addColorStop(1, "rgba(255, 107, 107, 0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(focalX, focalY, 30, 0, Math.PI * 2)
    ctx.fill()

    // Crosshair
    ctx.strokeStyle = "rgba(255, 107, 107, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(focalX - 20, focalY)
    ctx.lineTo(focalX + 20, focalY)
    ctx.moveTo(focalX, focalY - 20)
    ctx.lineTo(focalX, focalY + 20)
    ctx.stroke()
  }, [pixels, viewport, selectedPixel, canvasSize])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  useEffect(() => {
    if (autoSimulate) {
      return startSimulation()
    }
  }, [autoSimulate, startSimulation])

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate world coordinates
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    const worldX = Math.round(viewport.x + (mouseX - centerX) / (PIXEL_SIZE * viewport.zoom))
    const worldY = Math.round(viewport.y + (mouseY - centerY) / (PIXEL_SIZE * viewport.zoom))

    // Find pixel at this location
    const pixel = pixels.get(`${worldX},${worldY}`)
    setHoveredPixel(pixel || null)

    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / (PIXEL_SIZE * viewport.zoom)
      const dy = (e.clientY - dragStart.y) / (PIXEL_SIZE * viewport.zoom)
      setViewport({
        x: viewport.x - dx,
        y: viewport.y - dy,
      })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    const worldX = Math.round(viewport.x + (mouseX - centerX) / (PIXEL_SIZE * viewport.zoom))
    const worldY = Math.round(viewport.y + (mouseY - centerY) / (PIXEL_SIZE * viewport.zoom))

    const pixel = pixels.get(`${worldX},${worldY}`)
    selectPixel(pixel || null)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.5, Math.min(5, viewport.zoom * delta))
    setViewport({ zoom: newZoom })
  }

  const handleSearch = () => {
    const match = searchCoords.match(/(-?\d+)\s*,\s*(-?\d+)/)
    if (match) {
      setViewport({ x: parseInt(match[1]), y: parseInt(match[2]) })
      setShowSearch(false)
      setSearchCoords("")
    }
  }

  const zoomIn = () => setViewport({ zoom: Math.min(5, viewport.zoom * 1.2) })
  const zoomOut = () => setViewport({ zoom: Math.max(0.5, viewport.zoom / 1.2) })

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="block cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" onClick={zoomIn} className="bg-black/50 hover:bg-black/70 border-white/10">
            <ZoomIn className="size-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={zoomOut} className="bg-black/50 hover:bg-black/70 border-white/10">
            <ZoomOut className="size-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={jumpToFocalPoint} className="bg-black/50 hover:bg-black/70 border-white/10">
            <Target className="size-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={() => setShowSearch(!showSearch)} className="bg-black/50 hover:bg-black/70 border-white/10">
            <Search className="size-4" />
          </Button>
        </div>
      )}

      {/* Search input */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-16 flex items-center gap-2"
          >
            <Input
              placeholder="x, y (e.g. 0, 0)"
              value={searchCoords}
              onChange={(e) => setSearchCoords(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-40 bg-black/50 border-white/10"
            />
            <Button size="icon" variant="ghost" onClick={() => setShowSearch(false)}>
              <X className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coordinates display */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Badge variant="secondary" className="bg-black/50 border-white/10">
          <MapPin className="size-3 mr-1" />
          {Math.round(viewport.x)}, {Math.round(viewport.y)}
        </Badge>
        <Badge variant="secondary" className="bg-black/50 border-white/10">
          {Math.round(viewport.zoom * 100)}%
        </Badge>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4">
        <Badge variant="secondary" className="bg-black/50 border-white/10">
          {stats.activeUsers} users online • {stats.claimedPixels.toLocaleString()} pixels claimed
        </Badge>
      </div>

      {/* Hovered pixel info */}
      <AnimatePresence>
        {hoveredPixel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4"
          >
            <Card className="bg-black/70 border-white/10 backdrop-blur">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="size-6 rounded border border-white/20"
                    style={{ backgroundColor: hoveredPixel.color }}
                  />
                  <span className="text-sm font-medium">
                    ({hoveredPixel.x}, {hoveredPixel.y})
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Zone {hoveredPixel.zone}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="size-3" />
                  {hoveredPixel.ownerName}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  {new Date(hoveredPixel.placedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected pixel panel */}
      <AnimatePresence>
        {selectedPixel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            <Card className="w-64 bg-black/80 border-white/10 backdrop-blur">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Pixel Details</h3>
                  <Button size="icon" variant="ghost" onClick={() => selectPixel(null)} className="size-6">
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-lg border border-white/20"
                      style={{ backgroundColor: selectedPixel.color }}
                    />
                    <div>
                      <p className="font-medium">({selectedPixel.x}, {selectedPixel.y})</p>
                      <Badge variant="outline" className="mt-1">Zone {selectedPixel.zone}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner</span>
                      <span>{selectedPixel.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Placed</span>
                      <span>{new Date(selectedPixel.placedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color</span>
                      <span className="font-mono">{selectedPixel.color}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
