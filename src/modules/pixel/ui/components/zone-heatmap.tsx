"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Info, Target, TrendingUp } from "lucide-react"

import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import type { ZonePricing } from "@/modules/pixel"

interface ZoneHeatmapProps {
  className?: string
  interactive?: boolean
  size?: "sm" | "md" | "lg"
}

const zones: ZonePricing[] = [
  {
    zone: 0,
    name: "Focal Point",
    baseMultiplier: 10,
    competitionLevel: "extreme",
    description: "The center of attention. Only one can claim the throne at 0,0.",
  },
  {
    zone: 1,
    name: "Inner Ring",
    baseMultiplier: 3,
    competitionLevel: "high",
    description: "Prime real estate closest to the focal point. High visibility guaranteed.",
  },
  {
    zone: 2,
    name: "Middle Ring",
    baseMultiplier: 1.5,
    competitionLevel: "medium",
    description: "Great balance of visibility and value. Popular with creators.",
  },
  {
    zone: 3,
    name: "Outer Ring",
    baseMultiplier: 1,
    competitionLevel: "low",
    description: "Standard pricing zone. Perfect for large artworks and exploration.",
  },
]

const competitionColors = {
  extreme: { bg: "bg-red-500", text: "text-red-500", glow: "shadow-red-500/50" },
  high: { bg: "bg-orange-500", text: "text-orange-500", glow: "shadow-orange-500/50" },
  medium: { bg: "bg-yellow-500", text: "text-yellow-500", glow: "shadow-yellow-500/50" },
  low: { bg: "bg-green-500", text: "text-green-500", glow: "shadow-green-500/50" },
}

const sizeConfig = {
  sm: { container: "w-48 h-48", rings: [20, 40, 60, 80] },
  md: { container: "w-64 h-64", rings: [30, 55, 80, 105] },
  lg: { container: "w-80 h-80", rings: [40, 75, 110, 140] },
}

export function ZoneHeatmap({
  className = "",
  interactive = true,
  size = "md",
}: ZoneHeatmapProps) {
  const [hoveredZone, setHoveredZone] = useState<number | null>(null)
  const [selectedZone, setSelectedZone] = useState<ZonePricing | null>(null)
  const config = sizeConfig[size]

  const handleZoneClick = (zone: ZonePricing) => {
    if (interactive) {
      setSelectedZone(selectedZone?.zone === zone.zone ? null : zone)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
        {/* Heatmap Visual */}
        <div className={`relative ${config.container}`}>
          {/* Zone rings - rendered from outer to inner */}
          {[...zones].reverse().map((zone, reverseIndex) => {
            const index = zones.length - 1 - reverseIndex
            const radius = config.rings[index]
            const colors = competitionColors[zone.competitionLevel]
            const isHovered = hoveredZone === zone.zone
            const isSelected = selectedZone?.zone === zone.zone

            return (
              <motion.div
                key={zone.zone}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 ${
                  isHovered || isSelected ? `shadow-lg ${colors.glow}` : ""
                }`}
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  background: `radial-gradient(circle, transparent 70%, ${
                    zone.competitionLevel === "extreme"
                      ? "rgba(239, 68, 68, 0.3)"
                      : zone.competitionLevel === "high"
                      ? "rgba(249, 115, 22, 0.2)"
                      : zone.competitionLevel === "medium"
                      ? "rgba(234, 179, 8, 0.15)"
                      : "rgba(34, 197, 94, 0.1)"
                  } 100%)`,
                  border: `2px solid ${
                    zone.competitionLevel === "extreme"
                      ? "rgba(239, 68, 68, 0.5)"
                      : zone.competitionLevel === "high"
                      ? "rgba(249, 115, 22, 0.4)"
                      : zone.competitionLevel === "medium"
                      ? "rgba(234, 179, 8, 0.3)"
                      : "rgba(34, 197, 94, 0.2)"
                  }`,
                }}
                onMouseEnter={() => interactive && setHoveredZone(zone.zone)}
                onMouseLeave={() => interactive && setHoveredZone(null)}
                onClick={() => handleZoneClick(zone)}
                whileHover={interactive ? { scale: 1.02 } : {}}
              />
            )
          })}

          {/* Center focal point indicator */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/30 blur-md" />
              <Target className="relative size-6 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Zone Legend */}
        <div className="flex flex-col gap-3">
          {zones.map((zone) => {
            const colors = competitionColors[zone.competitionLevel]
            const isSelected = selectedZone?.zone === zone.zone

            return (
              <motion.button
                key={zone.zone}
                className={`flex items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                  isSelected ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => handleZoneClick(zone)}
                onMouseEnter={() => interactive && setHoveredZone(zone.zone)}
                onMouseLeave={() => interactive && setHoveredZone(null)}
                whileHover={interactive ? { x: 4 } : {}}
              >
                <div className={`size-4 rounded-full ${colors.bg}`} />
                <div>
                  <p className="text-sm font-medium">{zone.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {zone.baseMultiplier}x multiplier
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected Zone Details */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 size-3 rounded-full ${
                      competitionColors[selectedZone.competitionLevel].bg
                    }`}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{selectedZone.name}</h4>
                      <Badge
                        variant="outline"
                        className={competitionColors[selectedZone.competitionLevel].text}
                      >
                        <TrendingUp className="size-3 mr-1" />
                        {selectedZone.competitionLevel} competition
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedZone.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Info className="size-3" />
                      <span>Base price multiplier: {selectedZone.baseMultiplier}x</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

