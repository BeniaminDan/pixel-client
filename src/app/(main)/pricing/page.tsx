"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  CreditCard,
  Shield,
  Zap,
  Check,
  HelpCircle,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PricingCard, pricingPackages, PricingCalculator } from "@/components/pricing"
import { ZoneHeatmap } from "@/components/zone-heatmap"
import { StickyCTABar } from "@/components/sticky-cta-bar"

const comparisonData = [
  { feature: "Ownership", pixel: "Permanent, forever yours", traditional: "Temporary, rental-based" },
  { feature: "Pricing Model", pixel: "One-time purchase", traditional: "Monthly/CPM fees" },
  { feature: "Minimum Investment", pixel: "Starting at $5", traditional: "$500+ minimum" },
  { feature: "Hidden Fees", pixel: "None", traditional: "Platform fees, click fraud" },
  { feature: "Creative Freedom", pixel: "Any color, any design", traditional: "Template restrictions" },
  { feature: "Visibility Duration", pixel: "Unlimited", traditional: "Campaign duration only" },
]

const faqs = [
  {
    question: "Do credits expire?",
    answer: "No! Credits never expire. Buy them once and use them whenever you're ready.",
  },
  {
    question: "Can I get a refund?",
    answer: "Unused credits can be refunded within 30 days of purchase. Once pixels are placed, they're permanent.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and cryptocurrency through our secure Stripe integration.",
  },
  {
    question: "Is there a bulk discount?",
    answer: "Yes! The more credits you buy, the lower the price per pixel. Our Master package offers the best value at $0.05/pixel.",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center space-y-6">
          <Badge variant="outline" className="text-primary border-primary/30">
            <CreditCard className="size-3 mr-1.5" />
            Simple Pricing
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            1 Credit = 1 Pixel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            No hidden fees. No subscriptions. Buy credits once and own your
            pixels forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <Shield className="size-4 text-green-500" />
              Secure Payment
            </span>
            <span className="flex items-center gap-2">
              <Zap className="size-4 text-yellow-500" />
              Instant Delivery
            </span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              No Expiration
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pricingPackages.map((pkg, index) => (
              <PricingCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Not Sure How Many You Need?</h2>
              <p className="text-lg text-muted-foreground">
                Use our calculator to find the perfect package for your project.
                Whether you're placing a small logo or creating a masterpiece,
                we've got you covered.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Drag the slider</p>
                    <p className="text-sm text-muted-foreground">
                      Select how many pixels you want to place
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">See your recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      We'll show you the best value package
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Get started</p>
                    <p className="text-sm text-muted-foreground">
                      Purchase and start placing immediately
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <PricingCalculator />
          </div>
        </div>
      </section>

      {/* Zone Pricing */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Zone-Based Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Different zones have different multipliers. Premium spots closer
              to the Focal Point cost more due to higher visibility.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <ZoneHeatmap size="lg" interactive={true} />
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
                  <span className="font-medium">Zone 0 (Focal Point)</span>
                  <Badge variant="outline" className="text-red-500 border-red-500/30">
                    10x multiplier
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
                  <span className="font-medium">Zone 1 (Inner Ring)</span>
                  <Badge variant="outline" className="text-orange-500 border-orange-500/30">
                    3x multiplier
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
                  <span className="font-medium">Zone 2 (Middle Ring)</span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                    1.5x multiplier
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                  <span className="font-medium">Zone 3 (Outer Ring)</span>
                  <Badge variant="outline" className="text-green-500 border-green-500/30">
                    1x (base price)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Pixel vs Traditional Ads</h2>
            <p className="text-lg text-muted-foreground">
              See why permanent pixel ownership beats temporary advertising.
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">Pixel</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Traditional Ads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={row.feature} className={index < comparisonData.length - 1 ? "border-b" : ""}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-primary">
                            <Check className="size-4" />
                            {row.pixel}
                          </span>
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

      {/* FAQs */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="size-5 text-primary" />
                    {faq.question}
                  </CardTitle>
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
          <h2 className="text-3xl font-bold">Ready to Own Your Space?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with our Starter pack for just $5 and see what you can create.
          </p>
          <Button asChild size="lg" className="text-lg px-10">
            <Link href="/register">
              Get Started
              <ArrowRight className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <StickyCTABar
        ctaText="Buy Credits"
        message="Credits never expire - buy once, use forever"
      />
    </main>
  )
}
