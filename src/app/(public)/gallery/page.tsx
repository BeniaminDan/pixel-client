"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Grid,
  Clock,
  Heart,
  MapPin,
  ArrowRight,
  Crown,
  Swords,
  Filter,
} from "lucide-react"

import { Button } from "@/shared/ui/reusable/button"
import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/reusable/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/reusable/tabs"
import { StickyCTABar } from "@/shared/ui/components/sticky-cta-bar"
import { GalleryCreation, ThroneBattle } from "@/modules/pixel"
import { LiveStats } from "@/modules/pixel/ui"

// Mock gallery data
const mockCreations: GalleryCreation[] = [
  {
    id: "1",
    title: "Pixel Sunset",
    creatorId: "user-1",
    creatorName: "ArtMaster",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArtMaster",
    thumbnail: "",
    location: { x: 150, y: -200 },
    pixelCount: 2500,
    createdAt: "2024-12-15T10:00:00Z",
    likes: 342,
    featured: true,
  },
  {
    id: "2",
    title: "Rainbow Bridge",
    creatorId: "user-2",
    creatorName: "ColorQueen",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ColorQueen",
    thumbnail: "",
    location: { x: -300, y: 100 },
    pixelCount: 1800,
    createdAt: "2024-12-14T15:30:00Z",
    likes: 256,
  },
  {
    id: "3",
    title: "Neon City",
    creatorId: "user-3",
    creatorName: "PixelNinja",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelNinja",
    thumbnail: "",
    location: { x: 50, y: 50 },
    pixelCount: 3200,
    createdAt: "2024-12-13T08:00:00Z",
    likes: 489,
    featured: true,
  },
  {
    id: "4",
    title: "Forest Dreams",
    creatorId: "user-4",
    creatorName: "NatureLover",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NatureLover",
    thumbnail: "",
    location: { x: -150, y: -300 },
    pixelCount: 1200,
    createdAt: "2024-12-12T12:00:00Z",
    likes: 178,
  },
  {
    id: "5",
    title: "Space Station",
    creatorId: "user-5",
    creatorName: "CosmicArt",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CosmicArt",
    thumbnail: "",
    location: { x: 400, y: -100 },
    pixelCount: 4500,
    createdAt: "2024-12-11T18:00:00Z",
    likes: 621,
    featured: true,
  },
  {
    id: "6",
    title: "Retro Game",
    creatorId: "user-6",
    creatorName: "8BitKing",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8BitKing",
    thumbnail: "",
    location: { x: 200, y: 250 },
    pixelCount: 800,
    createdAt: "2024-12-10T09:00:00Z",
    likes: 145,
  },
]

const mockBattles: ThroneBattle[] = [
  {
    id: "battle-1",
    challengerId: "user-10",
    challengerName: "ThroneHunter",
    challengerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ThroneHunter",
    defenderId: "user-11",
    defenderName: "KingPixel",
    defenderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KingPixel",
    bidAmount: 7500,
    timestamp: "2024-12-17T14:30:00Z",
    outcome: "challenger_won",
  },
  {
    id: "battle-2",
    challengerId: "user-12",
    challengerName: "ArtChallenger",
    challengerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArtChallenger",
    defenderId: "user-10",
    defenderName: "ThroneHunter",
    defenderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ThroneHunter",
    bidAmount: 8200,
    timestamp: "2024-12-16T10:00:00Z",
    outcome: "defender_held",
  },
  {
    id: "battle-3",
    challengerId: "user-13",
    challengerName: "PixelWarrior",
    challengerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelWarrior",
    defenderId: "user-11",
    defenderName: "KingPixel",
    defenderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KingPixel",
    bidAmount: 6800,
    timestamp: "2024-12-15T16:45:00Z",
    outcome: "challenger_won",
  },
]

type FilterType = "all" | "popular" | "recent" | "featured"

export default function GalleryPage() {
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredCreations = mockCreations
    .filter((creation) => {
      if (filter === "featured") return creation.featured
      return true
    })
    .sort((a, b) => {
      if (filter === "popular") return b.likes - a.likes
      if (filter === "recent")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center space-y-6">
          <Badge variant="outline" className="text-primary border-primary/30">
            <Grid className="size-3 mr-1.5" />
            Community Gallery
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            Amazing Creations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Discover incredible pixel art from our community. Get inspired and
            add your own creation to the canvas.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="creations" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="creations">
                <Grid className="size-4 mr-2" />
                Creations
              </TabsTrigger>
              <TabsTrigger value="battles">
                <Swords className="size-4 mr-2" />
                Throne Battles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="creations" className="space-y-8">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  {(["all", "featured", "popular", "recent"] as FilterType[]).map(
                    (f) => (
                      <Button
                        key={f}
                        variant={filter === f ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className="capitalize"
                      >
                        {f}
                      </Button>
                    )
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {filteredCreations.length} creations
                </p>
              </div>

              {/* Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredCreations.map((creation, index) => (
                    <motion.div
                      key={creation.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Thumbnail placeholder */}
                        <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <Grid className="size-12 mx-auto text-muted-foreground/30" />
                              <p className="text-xs text-muted-foreground">
                                {creation.pixelCount.toLocaleString()} pixels
                              </p>
                            </div>
                          </div>
                          {creation.featured && (
                            <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-950">
                              Featured
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <Link
                              href={`/canvas?goto=${creation.location.x},${creation.location.y}`}
                            >
                              View on Canvas
                            </Link>
                          </Button>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{creation.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="size-5">
                                  <AvatarImage
                                    src={creation.creatorAvatar}
                                    alt={creation.creatorName}
                                  />
                                  <AvatarFallback>
                                    {creation.creatorName.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">
                                  {creation.creatorName}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Heart className="size-4" />
                              <span className="text-sm">{creation.likes}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              ({creation.location.x}, {creation.location.y})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {new Date(creation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="battles" className="space-y-8">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold">Throne Battle History</h2>
                <p className="text-muted-foreground">
                  Epic battles for the coveted 0,0 position
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                {mockBattles.map((battle, index) => (
                  <motion.div
                    key={battle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Challenger */}
                          <div className="flex-1 text-center">
                            <Avatar className="size-12 mx-auto mb-2">
                              <AvatarImage
                                src={battle.challengerAvatar}
                                alt={battle.challengerName}
                              />
                              <AvatarFallback>
                                {battle.challengerName.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm">
                              {battle.challengerName}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                battle.outcome === "challenger_won"
                                  ? "text-green-500 border-green-500/30"
                                  : "text-muted-foreground"
                              }
                            >
                              {battle.outcome === "challenger_won"
                                ? "Winner"
                                : "Challenger"}
                            </Badge>
                          </div>

                          {/* VS */}
                          <div className="text-center space-y-2">
                            <Swords className="size-8 mx-auto text-primary" />
                            <div>
                              <p className="font-bold text-lg">
                                ${battle.bidAmount.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(battle.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Defender */}
                          <div className="flex-1 text-center">
                            <div className="relative inline-block">
                              <Crown className="absolute -top-2 -right-2 size-4 text-yellow-500" />
                              <Avatar className="size-12 mx-auto mb-2">
                                <AvatarImage
                                  src={battle.defenderAvatar}
                                  alt={battle.defenderName}
                                />
                                <AvatarFallback>
                                  {battle.defenderName.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <p className="font-medium text-sm">
                              {battle.defenderName}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                battle.outcome === "defender_held"
                                  ? "text-green-500 border-green-500/30"
                                  : "text-muted-foreground"
                              }
                            >
                              {battle.outcome === "defender_held"
                                ? "Defended"
                                : "Dethroned"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/throne">
                    View All Battles
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl font-bold">Community Stats</h2>
            <p className="text-muted-foreground">
              Real-time activity from our growing community
            </p>
          </div>
          <LiveStats variant="grid" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/20">
            <CardContent className="py-12 px-8 text-center space-y-6">
              <h2 className="text-3xl font-bold">Add Your Creation</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creators and leave your permanent mark on the
                canvas.
              </p>
              <Button asChild size="lg">
                <Link href="/register">
                  Start Creating
                  <ArrowRight className="size-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <StickyCTABar
        ctaText="Add Your Creation"
        message="Join the community and create something amazing"
      />
    </main>
  )
}
