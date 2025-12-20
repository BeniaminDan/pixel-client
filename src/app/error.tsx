'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

import { AppHeader } from "@/shared/layouts/app-header";
import { AppFooter} from "@/shared/layouts/app-footer";
import { ClientActionButton } from "@/shared/ui/components/client-action-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/reusable/card'
import { useSession } from 'next-auth/react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const { data: session } = useSession()

  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader isStickyEnabled={false} user={session?.user} />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <div className="container flex max-w-2xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-destructive/20 blur-3xl" />
              <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:size-32">
                <AlertCircle className="size-12 sm:size-16" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Something went wrong!
              </h1>
              <p className="text-muted-foreground text-lg">
                An unexpected error occurred. Don&#39;t worry, we&#39;re on it.
              </p>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && error.message && (
            <Card className="w-full max-w-md border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Error Details</CardTitle>
                <CardDescription>This information is only visible in development</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-muted-foreground overflow-auto rounded-md bg-muted p-4 text-left text-xs">
                  {error.message}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>What would you like to do?</CardTitle>
              <CardDescription>
                Try these options to resolve the issue
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ClientActionButton onClick={reset} size="lg" className="w-full">
                Try Again
              </ClientActionButton>
              <ClientActionButton action="home" actionHref="/" variant="outline" size="lg" className="w-full" />
              <ClientActionButton action="back" variant="ghost" size="lg" className="w-full" />
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
      </main>
      <AppFooter />
    </div>
  )
}
