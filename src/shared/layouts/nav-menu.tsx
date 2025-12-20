"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/cn"

export type NavItem = {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Throne", href: "/throne" },
  { label: "Canvas", href: "/canvas" },
  { label: "Gallery", href: "/gallery" },
]

export function NavMenu({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={className} aria-label="Primary">
      <div className="text-muted-foreground flex items-center gap-6 px-4 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                isActive ? "text-foreground font-semibold" : ""
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
