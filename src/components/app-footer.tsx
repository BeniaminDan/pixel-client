"use client"

import Link from "next/link"

import { Logo } from "@/components/logo"

export function AppFooter() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Logo className="size-7" />
          <div className="space-y-1">
            <p className="text-foreground font-semibold">Pixel Studio</p>
            <p className="max-w-lg text-muted-foreground">
              Building a composable UI foundation for future Pixel experiences.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
