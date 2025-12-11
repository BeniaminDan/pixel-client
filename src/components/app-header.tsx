"use client"

import Link from "next/link"
import { ArrowRight, Menu, Search } from "lucide-react"

import { Logo } from "@/components/logo"
import { NavMenu } from "@/components/nav-menu"
import { SearchField } from "@/components/search-field"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navItems } from "@/components/nav-menu"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
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
            <Button size="default">
              Get Started
              <ArrowRight className="size-4" />
            </Button>
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
                <Button>
                  Get Started
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline">
                  Contact
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
