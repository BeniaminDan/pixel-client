"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, X, Sparkles } from "lucide-react"

import { useScrollThreshold } from "@/hooks"
import { Button } from "@/components/ui/button"

interface StickyCTABarProps {
  className?: string
  threshold?: number
  ctaText?: string
  ctaHref?: string
  message?: string
  dismissible?: boolean
}

export function StickyCTABar({
  className = "",
  threshold = 600,
  ctaText = "Claim Your Space",
  ctaHref = "/register",
  message = "Join thousands of creators owning their space on the internet",
  dismissible = true,
}: StickyCTABarProps) {
  const hasScrolled = useScrollThreshold(threshold)
  const [isDismissed, setIsDismissed] = useState(false)

  // Reset dismissed state when scrolling back up
  useEffect(() => {
    if (!hasScrolled) {
      setIsDismissed(false)
    }
  }, [hasScrolled])

  const isVisible = hasScrolled && !isDismissed

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
        >
          <div className="bg-gradient-to-r from-primary/95 to-primary backdrop-blur border-t border-primary-foreground/10 shadow-lg">
            <div className="container py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-primary-foreground">
                  <Sparkles className="size-5 shrink-0 hidden sm:block" />
                  <p className="text-sm font-medium">{message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <Link href={ctaHref}>
                      {ctaText}
                      <ArrowRight className="size-4 ml-1" />
                    </Link>
                  </Button>

                  {dismissible && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => setIsDismissed(true)}
                    >
                      <X className="size-4" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

