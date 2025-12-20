"use client"

import { LogOut, User, Settings } from "lucide-react"
import Link from "next/link"
import { logoutAction } from "@/modules/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/reusable/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/reusable/dropdown-menu"


interface UserMenuProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  view?: "dropdown" | "inline"
}

export function UserMenu({ user, view = "dropdown" }: UserMenuProps) {
  if (!user) {
    return null
  }

  const userInitials = user.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : user.email
      ? user.email.slice(0, 2).toUpperCase()
      : "U"

  async function handleSignOut() {
    await logoutAction()
  }

  if (view === "inline") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="size-10">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || user.email || "User"}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            {user.name && (
              <span className="truncate text-sm font-medium">{user.name}</span>
            )}
            {user.email && (
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href="/users/profile"
            className="hover:bg-muted flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors"
          >
            <User className="mr-2 size-4" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="hover:bg-muted flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors"
          >
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="hover:bg-destructive/10 text-destructive hover:text-destructive flex w-full items-center rounded-md px-2 py-2 text-left text-sm font-medium transition-colors"
          >
            <LogOut className="mr-2 size-4" />
            Log out
          </button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex size-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="User menu"
        >
          <Avatar className="size-8">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || user.email || "User"}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            {user.email && (
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/users/profile" className="w-full cursor-pointer">
            <User className="mr-2 size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="w-full cursor-pointer">
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
