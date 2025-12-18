"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CanvasViewer } from "@/components/canvas"

export default function CanvasPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Full-screen canvas */}
      <CanvasViewer className="absolute inset-0" showControls={true} autoSimulate={true} />

      {/* Guest mode overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <div className="flex items-center gap-3 rounded-full bg-black/80 backdrop-blur border border-white/10 px-4 py-2">
          <Badge variant="secondary" className="bg-white/10 text-white border-0">
            Guest Mode
          </Badge>
          <span className="text-sm text-white/70">
            Sign up to start painting
          </span>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/register">
              <LogIn className="size-4 mr-1.5" />
              Sign Up
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="absolute top-20 right-4"
      >
        <Button asChild className="shadow-lg">
          <Link href="/register">
            Claim Your Space
            <ArrowRight className="size-4 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </main>
  )
}
