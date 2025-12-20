"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Check, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { PricingPackage } from "@/types"

interface PricingCardProps {
  package: PricingPackage
  index?: number
}

export function PricingCard({ package: pkg, index = 0 }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`relative h-full ${
          pkg.popular
            ? "border-primary bg-gradient-to-b from-primary/10 to-transparent"
            : "border-border"
        }`}
      >
        {pkg.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-3">
              <Sparkles className="size-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{pkg.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">${pkg.price}</span>
              <span className="text-muted-foreground">one-time</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {pkg.credits.toLocaleString()} credits • ${pkg.pricePerCredit.toFixed(2)}/credit
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="size-4 text-primary mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            className="w-full"
            variant={pkg.popular ? "default" : "outline"}
            size="lg"
          >
            <Link href="/register">
              Get {pkg.name}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Preset packages for use across the app
export const pricingPackages: PricingPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 5,
    pricePerCredit: 0.10,
    features: [
      "50 pixels to place",
      "Access to Zone 2 & 3",
      "Basic color palette",
      "Community access",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    credits: 200,
    price: 15,
    pricePerCredit: 0.075,
    popular: true,
    features: [
      "200 pixels to place",
      "Access to all zones",
      "Full color palette",
      "Priority placement queue",
      "Creator badge",
    ],
  },
  {
    id: "artist",
    name: "Artist",
    credits: 500,
    price: 40,
    pricePerCredit: 0.08,
    features: [
      "500 pixels to place",
      "Access to all zones",
      "Full color palette",
      "Priority placement",
      "Artist badge",
      "Gallery feature eligibility",
    ],
  },
  {
    id: "master",
    name: "Master",
    credits: 2000,
    price: 100,
    pricePerCredit: 0.05,
    features: [
      "2,000 pixels to place",
      "Access to all zones",
      "Full color palette",
      "Instant placement",
      "Master badge",
      "Gallery feature priority",
      "Throne bid eligibility",
    ],
  },
]
