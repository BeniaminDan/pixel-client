"use client"

import { usePathname } from "next/navigation"
import { AppHeader } from "@/components"

/**
 * Routes that should have sticky headers enabled
 * Add or remove routes as needed
 */
const stickyHeaderRoutes = [
  "/"
]

/**
 * Check if the current route should have a sticky header
 */
function shouldHaveStickyHeader(pathname: string): boolean {
  return stickyHeaderRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

interface StickyHeaderWrapperProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function StickyHeaderWrapper({ user }: StickyHeaderWrapperProps) {
  const pathname = usePathname()
  const isStickyEnabled = shouldHaveStickyHeader(pathname)

  return <AppHeader isStickyEnabled={isStickyEnabled} user={user} />
}
