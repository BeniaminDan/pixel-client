"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  Crown,
  Trophy,
  Clock,
  DollarSign,
  ArrowRight,
  Shield,
  Star,
  Zap,
  AlertCircle,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThroneViewer, ThroneLeaderboard } from "@/components/throne"
import { StickyCTABar } from "@/components/sticky-cta-bar"

const biddingRules = [
  {
    icon: DollarSign,
    title: "Minimum Bid: +20%",
    description:
      "Each new bid must be at least 20% higher than the current throne value.",
  },
  {
    icon: Clock,
    title: "24-Hour Grace Period",
    description:
      "Current holder has 24 hours to match or exceed any challenging bid.",
  },
  {
    icon: Shield,
    title: "Defender Advantage",
    description:
      "If the defender matches the bid, they retain the throne. Ties go to the defender.",
  },
  {
    icon: Zap,
    title: "Instant Transfer",
    description:
      "If the grace period expires without a counter-bid, the throne transfers immediately.",
  },
]

const thronePerks = [
  "Your creation displayed at the exact center (0,0)",
  "Permanent entry in the Hall of Fame",
  "Special 'Throne Holder' badge on your profile",
  "Featured placement in the Gallery",
  "Priority support and early access to new features",
  "Recognition in community announcements",
]

export default function ThronePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,107,0.1)_0%,transparent_70%)]" />
        <div className="container relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="outline" className="text-primary border-primary/30">
                <Crown className="size-3 mr-1.5" />
                The Focal Point
              </Badge>

              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
                Battle for the{" "}
                <span className="text-primary">Throne</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                The center of the canvas at coordinates 0,0 is the most coveted
                spot. Only one creator can hold the Throne at a time. Do you
                have what it takes to claim it?
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/register">
                    Challenge the Throne
                    <ArrowRight className="size-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/canvas?goto=0,0">View Focal Point</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ThroneViewer showBids={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Bidding Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">How Bidding Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A fair, transparent system that rewards both challengers and defenders.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {biddingRules.map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <rule.icon className="size-6" />
                    </div>
                    <h3 className="font-semibold">{rule.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rule.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Process Timeline */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="size-5 text-primary" />
                  Challenge Process Example
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    {
                      time: "Day 1, 10:00 AM",
                      event: "Current throne value: $5,000",
                      type: "neutral",
                    },
                    {
                      time: "Day 1, 2:00 PM",
                      event: "Challenger bids $6,000 (+20%)",
                      type: "challenge",
                    },
                    {
                      time: "Day 1, 2:00 PM",
                      event: "24-hour grace period begins",
                      type: "neutral",
                    },
                    {
                      time: "Day 2, 10:00 AM",
                      event: "Defender counters with $7,200 (+20%)",
                      type: "defend",
                    },
                    {
                      time: "Day 2, 10:00 AM",
                      event: "New 24-hour grace period begins",
                      type: "neutral",
                    },
                    {
                      time: "Day 3, 10:00 AM",
                      event: "No counter - Challenger wins the Throne!",
                      type: "success",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`mt-1 size-3 rounded-full shrink-0 ${
                          item.type === "challenge"
                            ? "bg-orange-500"
                            : item.type === "defend"
                            ? "bg-blue-500"
                            : item.type === "success"
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.time}
                        </p>
                        <p className="font-medium">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Throne Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline">
                <Star className="size-3 mr-1.5" />
                Exclusive Perks
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Why Hold the Throne?
              </h2>
              <p className="text-lg text-muted-foreground">
                Being the Throne holder comes with exclusive benefits that set
                you apart from the rest of the community.
              </p>
              <ul className="space-y-3">
                {thronePerks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="size-5 text-primary mt-0.5 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/20">
              <CardContent className="p-8 text-center space-y-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Crown className="size-20 mx-auto text-yellow-500" />
                </motion.div>
                <h3 className="text-2xl font-bold">Become a Legend</h3>
                <p className="text-muted-foreground">
                  Every Throne holder is immortalized in the Hall of Fame.
                  Your reign becomes part of Pixel history.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/register">
                    Start Your Challenge
                    <ArrowRight className="size-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">
              <Trophy className="size-3 mr-1.5" />
              Hall of Fame
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Legendary Throne Holders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The brave creators who have held the most coveted spot on the canvas.
            </p>
          </div>

          <ThroneLeaderboard showCurrentHolder={true} maxRecords={10} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-t from-primary/10 to-background">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Make History?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The Throne awaits its next challenger. Will it be you?
          </p>
          <Button asChild size="lg" className="text-lg px-10">
            <Link href="/register">
              Challenge the Throne
              <Crown className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <StickyCTABar
        ctaText="Challenge Now"
        message="The Throne is waiting for its next ruler"
      />
    </main>
  )
}
