"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function SearchField({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="size-4" />
        <span className="sr-only">Search</span>
      </div>
      <Input placeholder="Search" className="pl-9" />
    </div>
  )
}
