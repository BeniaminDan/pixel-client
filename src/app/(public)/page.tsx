"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowRight,
  Sparkles,
  Crown,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Check,
  ChevronRight,
} from "lucide-react"

import { FluidHeroBackground } from "@/shared/ui/components/fluid-hero-background"
import { Button } from "@/shared/ui/reusable/button"
import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent } from "@/shared/ui/reusable/card"
import { ThroneViewer } from "@/modules/throne";
import { PricingCard, pricingPackages } from "@/shared/ui/components/pricing-card";
import { LiveStats, ZoneHeatmap } from "@/modules/pixel";
import { TrustSignals } from "@/modules/pixel";
import { StickyCTABar} from "@/shared/ui/components/sticky-cta-bar";

const valueProps = [
  {
    icon: Shield,
    title: "Permanent Ownership",
    description:
      "Your pixels are yours forever. No subscriptions, no renewals. Once you claim it, it's part of internet history.",
  },
  {
    icon: Crown,
    title: "Real-Time Competition",
    description:
      "Battle for the Throne at 0,0 - the most valuable spot on the canvas. Challenge, defend, and claim your legacy.",
  },
  {
    icon: TrendingUp,
    title: "Growing Value",
    description:
      "As the canvas fills, prime locations become more valuable. Early adopters benefit from strategic positioning.",
  },
]

const howItWorks = [
  {
    step: 1,
    title: "Create Account",
    description: "Sign up in seconds with email or social login. No credit card required to explore.",
  },
  {
    step: 2,
    title: "Buy Credits",
    description: "Choose a credit package that fits your vision. 1 credit = 1 pixel to place anywhere.",
  },
  {
    step: 3,
    title: "Explore Canvas",
    description: "Navigate the infinite canvas, find the perfect spot, and see what others have created.",
  },
  {
    step: 4,
    title: "Paint Forever",
    description: "Place your pixels and watch them become permanent. Your mark on the internet, forever.",
  },
]

const comparisonData = [
  { feature: "Ownership Duration", pixel: "Forever", traditional: "Monthly rental" },
  { feature: "Minimum Spend", pixel: "$5", traditional: "$500+" },
  { feature: "Audience", pixel: "Global community", traditional: "Targeted segments" },
  { feature: "Creative Control", pixel: "Full pixel control", traditional: "Template-based" },
  { feature: "Hidden Fees", pixel: "None", traditional: "Platform fees, CPM" },
]

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative isolate flex min-h-[100dvh] w-full items-center overflow-hidden pt-24 pb-12 sm:pb-16 lg:pb-24">
        <FluidHeroBackground
          config={{
            BACK_TRANSPARENT: true,
            COLOR_PALETTE: ["var(--primary)"],
            BLOOM_INTENSITY: 0.6,
            DENSITY_DISSIPATION: 2.0,
          }}
          overlayClassName="from-black/55 via-black/45 to-black/65"
        />

        <div className="container relative flex flex-col items-center gap-10 sm:gap-16 lg:gap-20">
          <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
            <Badge className="border-white/20 bg-white/10 px-3 py-1 text-sm font-normal text-white">
              <Sparkles className="size-3 mr-1.5" />
              The canvas is live
            </Badge>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              Own Your Space on the{" "}
              <span className="text-primary">Internet Forever</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-2xl text-lg text-white/70"
            >
              A collaborative canvas where every pixel tells a story. Claim your
              territory, create art, and battle for the legendary Throne at 0,0.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/register">
                  Claim Your Space
                  <ArrowRight className="size-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/canvas">Explore Canvas</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TrustSignals className="mt-4" />
            </motion.div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        {/*<motion.div*/}
        {/*  className="absolute bottom-0"*/}
        {/*  initial={{ opacity: 0, y: 40 }}*/}
        {/*  animate={{ opacity: 1, y: 0 }}*/}
        {/*  transition={{ duration: 0.8, delay: 0.4 }}*/}
        {/*>*/}
        {/*  <CanvasPreview size="lg" showControls={true} />*/}
        {/*</motion.div>*/}
      </section>

      {/* Focal Point Showcase */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-primary border-primary/30">
                <Crown className="size-3 mr-1.5" />
                The Throne
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Battle for the Most Valuable Spot
              </h2>
              <p className="text-lg text-muted-foreground">
                The Focal Point at coordinates 0,0 is the center of attention.
                Only one can hold the Throne at a time. Challenge the current
                holder with a higher bid, defend your position, and become a
                legend.
              </p>
              <ul className="space-y-3">
                {[
                  "Highest visibility on the entire canvas",
                  "Permanent record in the Hall of Fame",
                  "Special badge and recognition",
                  "Your creation at the center of it all",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/throne">
                  Learn About the Throne
                  <ChevronRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="lg:pl-8">
              <ThroneViewer showBids={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose Pixel?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just pixels - it&#39;s your permanent mark on the internet.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6 space-y-4">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <prop.icon className="size-7" />
                    </div>
                    <h3 className="text-xl font-semibold">{prop.title}</h3>
                    <p className="text-muted-foreground">{prop.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes. Create your legacy in seconds.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/how-it-works">
                Learn More
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Stats / Social Proof */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Join Thousands of Creators
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time activity from our growing community.
            </p>
          </div>
          <LiveStats variant="grid" />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Simple Pricing</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              1 Credit = 1 Pixel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees, no subscriptions. Buy credits once, use them forever.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pricingPackages.map((pkg, index) => (
              <PricingCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">
                View Full Pricing
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Pixel vs Traditional Ads
            </h2>
            <p className="text-lg text-muted-foreground">
              Why permanent ownership beats temporary exposure.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">
                        Pixel
                      </th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        Traditional Ads
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={row.feature} className={index < comparisonData.length - 1 ? "border-b" : ""}>
                        <td className="p-4">{row.feature}</td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {row.pixel}
                          </Badge>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {row.traditional}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Zone Heatmap */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Canvas Zones</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Strategic Positioning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Different zones offer different opportunities. The closer to the
              center, the higher the visibility and competition.
            </p>
          </div>
          <div className="flex justify-center">
            <ZoneHeatmap size="lg" interactive={true} />
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Zap className="size-3 mr-1.5" />
              Limited Space
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Prime Spots Are Going Fast
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The canvas is filling up. Secure your position before the best
              locations are claimed by someone else.
            </p>
          </motion.div>

          <LiveStats variant="inline" className="justify-center" />

          <Button asChild size="lg" className="text-lg px-10">
            <Link href="/register">
              Claim Your Space Now
              <ArrowRight className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/20">
            <CardContent className="py-12 px-8 text-center space-y-6">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to Make Your Mark?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join the community of creators, artists, and visionaries who are
                building something permanent together.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base px-8">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="size-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/canvas">
                    <Users className="size-4 mr-2" />
                    Explore the Canvas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <StickyCTABar threshold={800} />
    </main>
  )
}
