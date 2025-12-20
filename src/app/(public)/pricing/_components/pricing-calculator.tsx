"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Calculator, ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/shared/ui/reusable/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/reusable/card"
import { Badge } from "@/shared/ui/reusable/badge"
import { pricingPackages } from "@/shared/ui/components/pricing-card";

interface PricingCalculatorProps {
  className?: string
}

export function PricingCalculator({ className = "" }: PricingCalculatorProps) {
  const [pixelsNeeded, setPixelsNeeded] = useState(100)

  const recommendation = useMemo(() => {
    // Find the best package for the pixel count
    const sortedPackages = [...pricingPackages].sort((a, b) => a.credits - b.credits)

    // Find smallest package that covers the need
    const exactMatch = sortedPackages.find((pkg) => pkg.credits >= pixelsNeeded)

    // Calculate if buying multiple smaller packages is better
    let bestOption = exactMatch || sortedPackages[sortedPackages.length - 1]
    let quantity = 1

    if (exactMatch) {
      // Check if the next smaller package times 2 is better value
      const smallerPackages = sortedPackages.filter((pkg) => pkg.credits < pixelsNeeded)
      for (const smaller of smallerPackages.reverse()) {
        const needed = Math.ceil(pixelsNeeded / smaller.credits)
        const totalCost = smaller.price * needed
        const totalCredits = smaller.credits * needed

        if (totalCost <= exactMatch.price && totalCredits >= pixelsNeeded) {
          bestOption = smaller
          quantity = needed
          break
        }
      }
    } else {
      // Need multiple of the largest package
      quantity = Math.ceil(pixelsNeeded / bestOption.credits)
    }

    const totalCredits = bestOption.credits * quantity
    const totalPrice = bestOption.price * quantity
    const effectivePrice = totalPrice / pixelsNeeded

    return {
      package: bestOption,
      quantity,
      totalCredits,
      totalPrice,
      effectivePrice,
      savings: pixelsNeeded * 0.15 - totalPrice, // vs $0.15/pixel baseline
    }
  }, [pixelsNeeded])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            Pixel Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="pixel-slider" className="text-sm font-medium">
                How many pixels do you need?
              </label>
              <Badge variant="secondary" className="text-lg font-bold px-3">
                {pixelsNeeded.toLocaleString()}
              </Badge>
            </div>

            <input
              id="pixel-slider"
              type="range"
              min={10}
              max={5000}
              step={10}
              value={pixelsNeeded}
              onChange={(e) => setPixelsNeeded(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>1,000</span>
              <span>2,500</span>
              <span>5,000</span>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recommended</span>
              {recommendation.package.popular && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Sparkles className="size-3 mr-1" />
                  Best Value
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">
                  {recommendation.quantity > 1
                    ? `${recommendation.quantity}x ${recommendation.package.name}`
                    : recommendation.package.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {recommendation.totalCredits.toLocaleString()} credits included
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${recommendation.totalPrice}</p>
                <p className="text-xs text-muted-foreground">
                  ${recommendation.effectivePrice.toFixed(3)}/pixel
                </p>
              </div>
            </div>

            {recommendation.savings > 0 && (
              <p className="text-sm text-green-500">
                Save ${recommendation.savings.toFixed(2)} vs standard pricing
              </p>
            )}

            <Button asChild className="w-full" size="lg">
              <Link href="/register">
                Get Started
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Credits never expire • Instant delivery • Secure payment
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
