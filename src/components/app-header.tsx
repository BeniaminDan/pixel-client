"use client"

import Link from "next/link"
import { ArrowRight, Menu, Search } from "lucide-react"

import { useScrollThreshold } from "@/hooks"
import { Logo } from "@/components/logo"
import { NavMenu, navItems } from "@/components/nav-menu"
import { SearchField } from "@/components/search-field"
import { SocialLinks } from "@/components/social-links"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"

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
  const hasScrolled = useScrollThreshold(50, isStickyEnabled)

  const positioningClass = isStickyEnabled
    ? "fixed top-0 z-50 w-full"
    : "relative w-full"
  const surfaceClass = isStickyEnabled
    ? hasScrolled
      ? "bg-background text-foreground shadow-md"
      : "bg-transparent text-foreground"
    : "bg-background text-foreground"
  const transitionClass = isStickyEnabled ? "transition-all duration-500" : ""

  return (
    <header
      className={`${positioningClass} ${surfaceClass} ${transitionClass} z-50`}
    >
      <div className="container flex items-center justify-between gap-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="size-8" />
          <span className="text-xl font-semibold max-sm:hidden">
            Pixel Studio
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="bg-muted flex items-center gap-6 rounded-md px-5 py-2.5">
            <NavMenu />
            <SearchField className="max-xl:hidden w-64" />
            <div className="flex items-center gap-2 max-xl:hidden">
              <SocialLinks />
              <ThemeToggle />
            </div>
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
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="size-4" />
          </Button>
          <SocialLinks className="max-sm:hidden" />
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
                  <p className="text-sm font-semibold">Pixel Studio</p>
                  <p className="text-muted-foreground text-xs">
                    Navigation
                  </p>
                </div>
              </div>
              <div className="px-4">
                <SearchField className="mt-4" />
              </div>
              <div className="flex flex-col gap-2 px-4 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-foreground rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="px-4">
                <SocialLinks />
              </div>
              <div className="grid grid-cols-2 gap-2 px-4 pb-6 pt-4">
                {user ? (
                  <div className="col-span-2">
                    <UserMenu user={user} />
                  </div>
                ) : (
                  <>
                    <Button asChild>
                      <Link href="/login">
                        Get Started
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button variant="outline">
                      Contact
                    </Button>
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
