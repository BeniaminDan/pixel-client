"use client"

import {useEffect} from "react"
import {motion} from "motion/react"
import {Clock, Crown, TrendingUp} from "lucide-react"

import {useThroneStore} from "@/stores"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent} from "@/components/ui/card"

interface ThroneViewerProps {
  className?: string
  showBids?: boolean
  autoSimulate?: boolean
}

export function ThroneViewer({
  className = "",
  showBids = true,
  autoSimulate = true,
}: ThroneViewerProps) {
  const { currentHolder, recentBids, stats, startSimulation } = useThroneStore()

  useEffect(() => {
    if (autoSimulate) {
      return startSimulation()
    }
  }, [autoSimulate, startSimulation])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <CardContent className="p-6 space-y-6">
          {/* Current Holder Section */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2"
              >
                <Crown className="size-8 text-yellow-500 drop-shadow-lg" />
              </motion.div>
              <Avatar className="size-20 ring-4 ring-yellow-500/30">
                <AvatarImage src={currentHolder.avatar} alt={currentHolder.name} />
                <AvatarFallback>{currentHolder.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="text-xl font-bold">{currentHolder.name}</h3>
              <p className="text-sm text-muted-foreground">Current Throne Holder</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Clock className="size-3" />
                {currentHolder.duration}
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                <TrendingUp className="size-3" />
                ${stats.currentValue.toLocaleString()}
              </Badge>
            </div>
          </div>

          {/* Focal Point Visual */}
          <div className="relative aspect-square max-w-[200px] mx-auto">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-500/20 via-orange-500/10 to-yellow-500/20 animate-pulse" />
            <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-red-500/30 via-orange-500/20 to-yellow-500/30" />
            <div className="absolute inset-8 rounded-lg bg-gradient-to-br from-red-500/40 via-orange-500/30 to-yellow-500/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">0,0</p>
                <p className="text-xs text-white/70">Focal Point</p>
              </div>
            </div>
          </div>

          {/* Recent Bids */}
          {showBids && recentBids.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {recentBids.slice(0, 5).map((bid, index) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={bid.bidderAvatar} alt={bid.bidderName} />
                      <AvatarFallback>{bid.bidderName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{bid.bidderName}</p>
                      <p className="text-xs text-muted-foreground">
                        ${bid.amount.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        bid.status === "pending"
                          ? "text-yellow-500 border-yellow-500/30"
                          : bid.status === "outbid"
                          ? "text-red-500 border-red-500/30"
                          : "text-green-500 border-green-500/30"
                      }
                    >
                      {bid.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
