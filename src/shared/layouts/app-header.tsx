"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu } from "lucide-react"

import { useScrollThreshold } from "@/shared/hooks/useScrollThreshold"
import { Logo } from "@/shared/ui/components/logo";
import { NavMenu, navItems } from "@/shared/layouts/nav-menu";
import { UserMenu } from "@/shared/layouts/user-menu";
import { Button } from "@/shared/ui/reusable/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/reusable/sheet"
import { ThemeToggle } from "@/shared/ui/components/theme-toggle";

interface AppHeaderProps {
  /** Toggles sticky positioning and scroll-driven surface changes */
  isStickyEnabled?: boolean
  /** Current user session data */
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function AppHeader({ isStickyEnabled = true, user }: AppHeaderProps) {
  const hasScrolled = useScrollThreshold(50, true)
  const pathname = usePathname()

  const positioningClass = isStickyEnabled
    ? "fixed top-0"
    : "sticky top-0"
  const surfaceClass = isStickyEnabled
    ? hasScrolled
      ? "bg-background text-foreground shadow-md"
      : "bg-transparent text-foreground"
    : hasScrolled
      ? "bg-background text-foreground"
      : "bg-background text-foreground"

  return (
    <header
      className={`${positioningClass} ${surfaceClass} w-full transition-all duration-500 z-50`}
    >
      <div className="container flex items-center justify-between gap-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="size-8" />
          <span className="text-xl font-semibold">Pixel Studio</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="bg-muted flex items-center rounded-md">
            <NavMenu />

            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button size="default" asChild>
                <Link href="/login">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex items-center gap-3 px-4 pt-4">
                <Logo className="size-7" />
                <div>
                  <p className="text-sm font-semibold">Pixel Studios</p>
                  <p className="text-muted-foreground text-xs">
                    Own Your Space Forever
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 px-4 py-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 gap-2 px-4 pb-6 pt-4 border-t">
                {user ? (
                  <div className="col-span-2">
                    <UserMenu user={user} view="inline" />
                  </div>
                ) : (
                  <>
                    <Button asChild>
                      <Link href="/login">
                        Get Started
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button variant="outline">Contact</Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
