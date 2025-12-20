"use client"

import {useEffect} from "react"
import {motion} from "motion/react"
import {Crown, DollarSign, Sparkles, TrendingUp, Users} from "lucide-react"

import {useStatsStore} from "@/stores"
import {Badge} from "@/components/ui/badge"

interface LiveStatsProps {
  className?: string
  variant?: "inline" | "grid" | "compact"
  autoSimulate?: boolean
}

export function LiveStats({
  className = "",
  variant = "inline",
  autoSimulate = true,
}: LiveStatsProps) {
  const { stats, startSimulation } = useStatsStore()

  useEffect(() => {
    if (autoSimulate) {
      return startSimulation()
    }
  }, [autoSimulate, startSimulation])

  const statItems = [
    {
      label: "Pixels Claimed Today",
      value: stats.pixelsClaimedToday.toLocaleString(),
      icon: Sparkles,
      color: "text-primary",
    },
    {
      label: "Active Users",
      value: stats.activeUsersNow.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Throne Value",
      value: `$${stats.throneValue.toLocaleString()}`,
      icon: Crown,
      color: "text-yellow-500",
    },
    {
      label: "Total Pixels Owned",
      value: stats.totalPixelsOwned.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-500",
    },
  ]

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {statItems.slice(0, 3).map((stat) => (
          <Badge
            key={stat.label}
            variant="secondary"
            className="gap-1.5 bg-white/10 text-white border-white/20"
          >
            <stat.icon className={`size-3 ${stat.color}`} />
            {stat.value}
          </Badge>
        ))}
      </div>
    )
  }

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-2 gap-4 md:grid-cols-4 ${className}`}>
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border bg-card p-4 text-center"
          >
            <div className={`mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="size-5" />
            </div>
            <motion.p
              key={stat.value}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
            >
              {stat.value}
            </motion.p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    )
  }

  // Default inline variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-wrap items-center justify-center gap-6 text-sm ${className}`}
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          <stat.icon className={`size-4 ${stat.color}`} />
          <span className="text-muted-foreground">{stat.label}:</span>
          <motion.span
            key={stat.value}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="font-semibold"
          >
            {stat.value}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Trust signals variant for hero sections
export function TrustSignals({ className = "" }: { className?: string }) {
  const { stats, startSimulation } = useStatsStore()

  useEffect(() => {
    return startSimulation()
  }, [startSimulation])

  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-2 text-white/80">
        <Sparkles className="size-4 text-primary" />
        <span>{stats.totalPixelsOwned.toLocaleString()}+ pixels owned</span>
      </div>
      <div className="hidden sm:block text-white/40">•</div>
      <div className="flex items-center gap-2 text-white/80">
        <DollarSign className="size-4 text-green-500" />
        <span>${stats.totalDollarsSpent.toLocaleString()} Throne value</span>
      </div>
      <div className="hidden sm:block text-white/40">•</div>
      <div className="flex items-center gap-2 text-white/80">
        <Crown className="size-4 text-yellow-500" />
        <span>Permanent ownership</span>
      </div>
    </div>
  )
}

