"use client"

import Link from "next/link"

type NavItem = {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Dashboard", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Product Details", href: "#" },
]

export function NavMenu({ className }: { className?: string }) {
  return (
    <nav className={className} aria-label="Primary">
      <div className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
