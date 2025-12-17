import Link from 'next/link'
import { ServerOff, Home } from 'lucide-react'

import { RefreshButton } from '@/components/status-pages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ServerError() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16 sm:py-24">
      <div className="container flex max-w-2xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-destructive/20 blur-3xl" />
            <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:size-32">
              <ServerOff className="size-12 sm:size-16" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              500 - Server Error
            </h1>
            <p className="text-muted-foreground text-lg">
              Our servers encountered an unexpected error. We're working to fix it.
            </p>
          </div>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>What would you like to do?</CardTitle>
            <CardDescription>
              Here are some options to help you continue
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <RefreshButton />
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">
                <Home className="size-4" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-sm">
          <p>
            If the problem persists, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
