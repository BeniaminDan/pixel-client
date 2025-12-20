"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  UserPlus,
  CreditCard,
  Compass,
  Paintbrush,
  ArrowRight,
  Play,
  ChevronDown,
  HelpCircle,
  MapPin,
  Crown,
  Palette,
  MousePointer,
} from "lucide-react"

import { Button } from "@/shared/ui/reusable/button"
import { Badge } from "@/shared/ui/reusable/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/reusable/card"
import { ZoneHeatmap } from "@/modules/pixel";
import { StickyCTABar } from "@/shared/ui/components/sticky-cta-bar";

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds using email or your favorite social login. No credit card required to start exploring.",
    details: [
      "Email or social login (Google, GitHub, Discord)",
      "Verify your email to unlock all features",
      "Customize your profile and avatar",
      "Join the community Discord for updates",
    ],
    tip: "Pro tip: Complete your profile to earn a bonus 5 free credits!",
  },
  {
    step: 2,
    icon: CreditCard,
    title: "Buy Credits",
    description:
      "Choose a credit package that fits your vision. 1 credit = 1 pixel. Credits never expire.",
    details: [
      "Starter: 50 credits for $5 (perfect for logos)",
      "Creator: 200 credits for $15 (most popular)",
      "Artist: 500 credits for $40 (for ambitious projects)",
      "Master: 2,000 credits for $100 (best value)",
    ],
    tip: "Bulk purchases get better rates. Master package is $0.05/pixel!",
  },
  {
    step: 3,
    icon: Compass,
    title: "Explore the Canvas",
    description:
      "Navigate the infinite canvas, discover amazing creations, and find the perfect spot for your art.",
    details: [
      "Pan and zoom to explore the entire canvas",
      "Jump to coordinates with the search feature",
      "See pixel info: owner, date placed, zone",
      "Watch real-time updates as others place pixels",
    ],
    tip: "Use keyboard shortcuts: Arrow keys to pan, +/- to zoom, G to go to coordinates.",
  },
  {
    step: 4,
    icon: Paintbrush,
    title: "Paint Forever",
    description:
      "Place your pixels and watch them become permanent. Your creation is now part of internet history.",
    details: [
      "Choose any color from the full RGB palette",
      "Click to place, drag for multiple pixels",
      "Undo within 5 minutes if you make a mistake",
      "Your pixels are permanent once confirmed",
    ],
    tip: "Plan your design before placing. Use our pixel art tools for precision!",
  },
]

const faqs = [
  {
    question: "Can I move my pixels after placing them?",
    answer:
      "Once placed, pixels are permanent. However, you have a 5-minute window to undo recent placements. Plan your design carefully!",
  },
  {
    question: "What happens if someone else wants my spot?",
    answer:
      "Regular pixels are permanent once placed - no one can take them. Only the Throne (0,0) can change hands through the bidding system.",
  },
  {
    question: "Can I collaborate with others?",
    answer:
      "Absolutely! Many creators coordinate through our Discord to create large collaborative artworks. You can also share coordinates to work together.",
  },
  {
    question: "What file formats can I import?",
    answer:
      "We support importing PNG, JPG, and GIF images. Our tool will convert them to pixel art and show you exactly how many credits you need.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Yes! Our canvas is fully responsive and works on mobile browsers. Native iOS and Android apps are coming soon.",
  },
  {
    question: "What if the site goes down?",
    answer:
      "We maintain multiple backups and the canvas data is stored permanently. Your pixels will always be accessible.",
  },
]

const canvasFeatures = [
  {
    icon: MousePointer,
    title: "Pan & Zoom",
    description: "Navigate smoothly across the infinite canvas",
  },
  {
    icon: MapPin,
    title: "Coordinate Jump",
    description: "Go directly to any location with x,y coordinates",
  },
  {
    icon: Crown,
    title: "Focal Point",
    description: "One-click jump to the legendary 0,0 position",
  },
  {
    icon: Palette,
    title: "Full Color",
    description: "16.7 million colors available in the picker",
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center space-y-6">
          <Badge variant="outline" className="text-primary border-primary/30">
            Getting Started
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            How Pixel Works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            From signup to your first pixel in under 5 minutes. Here&#39;s
            everything you need to know.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <Button asChild size="lg">
              <Link href="/register">
                Get Started
                <ArrowRight className="size-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Play className="size-4 mr-2" />
              Watch Tutorial
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className={`grid gap-8 lg:grid-cols-2 lg:items-center ${
                    index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl">
                          {step.step}
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">
                            Step {step.step} of 4
                          </Badge>
                          <h2 className="text-2xl font-bold sm:text-3xl">
                            {step.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-lg text-muted-foreground">
                        {step.description}
                      </p>

                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronDown className="size-5 text-primary mt-0.5 rotate-[-90deg]" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                        <p className="text-sm">
                          <strong className="text-primary">💡 {step.tip}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <Card className="aspect-video flex items-center justify-center bg-muted/50">
                      <div className="text-center space-y-4">
                        <step.icon className="size-16 mx-auto text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          Step {step.step} illustration
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorial */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="outline">Video Guide</Badge>
            <h2 className="text-3xl font-bold">Watch the Tutorial</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See Pixel in action with our 2-minute walkthrough video.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto aspect-video flex items-center justify-center bg-black/50">
            <Button size="lg" variant="secondary" className="gap-2">
              <Play className="size-6" />
              Play Video
            </Button>
          </Card>
        </div>
      </section>

      {/* Canvas Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Canvas Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to help you navigate and create.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {canvasFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6 space-y-3">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild>
              <Link href="/canvas">
                Try the Canvas
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Zone Guide */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">Canvas Zones</Badge>
            <h2 className="text-3xl font-bold">Understanding the Zones</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The canvas is divided into zones based on distance from the Focal
              Point. Closer zones have higher visibility and pricing.
            </p>
          </div>

          <div className="flex justify-center">
            <ZoneHeatmap size="lg" interactive={true} />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline">
              <HelpCircle className="size-3 mr-1.5" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-t from-primary/10 to-background">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your account and place your first pixel in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-10">
              <Link href="/register">
                Create Account
                <ArrowRight className="size-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/canvas">Explore First</Link>
            </Button>
          </div>
        </div>
      </section>

      <StickyCTABar />
    </main>
  )
}
