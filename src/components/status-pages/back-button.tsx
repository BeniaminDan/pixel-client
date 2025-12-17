'use client'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function BackButton() {
  return (
    <Button
      variant="ghost"
      size="lg"
      className="w-full"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.history.back()
        }
      }}
    >
      <ArrowLeft className="size-4" />
      Go Back
    </Button>
  )
}
