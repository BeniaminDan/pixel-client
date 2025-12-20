"use client"

import {useEffect} from "react"
import {motion} from "motion/react"
import {Clock, Crown, DollarSign, Medal, Trophy} from "lucide-react"

import { useThroneStore } from "@/modules/throne"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/reusable/avatar"
import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/reusable/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/reusable/table"

interface ThroneLeaderboardProps {
  className?: string
  showCurrentHolder?: boolean
  maxRecords?: number
  autoSimulate?: boolean
}

export function ThroneLeaderboard({
  className = "",
  showCurrentHolder = true,
  maxRecords = 10,
  autoSimulate = true,
}: ThroneLeaderboardProps) {
  const { currentHolder, hallOfFame, stats, startSimulation } = useThroneStore()

  useEffect(() => {
    if (autoSimulate) {
      return startSimulation()
    }
  }, [autoSimulate, startSimulation])

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="size-5 text-yellow-500" />
      case 1:
        return <Medal className="size-5 text-gray-400" />
      case 2:
        return <Medal className="size-5 text-amber-600" />
      default:
        return <span className="text-sm text-muted-foreground font-medium">{index + 1}</span>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            Hall of Fame
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Holder Highlight */}
          {showCurrentHolder && (
            <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Crown className="absolute -top-2 -right-2 size-5 text-yellow-500" />
                  <Avatar className="size-12 ring-2 ring-primary/30">
                    <AvatarImage src={currentHolder.avatar} alt={currentHolder.name} />
                    <AvatarFallback>{currentHolder.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{currentHolder.name}</p>
                  <p className="text-sm text-muted-foreground">Current Holder</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="size-3" />
                    {currentHolder.duration}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <DollarSign className="size-3" />
                    {stats.currentValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold">{stats.totalChallenges}</p>
              <p className="text-xs text-muted-foreground">Total Challenges</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold">{stats.longestReign}</p>
              <p className="text-xs text-muted-foreground">Longest Reign</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold">{stats.averageReign}</p>
              <p className="text-xs text-muted-foreground">Avg. Reign</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold">${stats.currentValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Current Value</p>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Final Bid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hallOfFame.slice(0, maxRecords).map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getMedalIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={record.holderAvatar} alt={record.holderName} />
                          <AvatarFallback>{record.holderName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.holderName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.duration}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${record.finalBid.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
