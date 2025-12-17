import Link from 'next/link'
import { ShieldAlert, Home } from 'lucide-react'

import { BackButton } from '@/components/status-pages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Forbidden() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16 sm:py-24">
      <div className="container flex max-w-2xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-32">
              <ShieldAlert className="size-12 sm:size-16" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              403 - Access Forbidden
            </h1>
            <p className="text-muted-foreground text-lg">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>What would you like to do?</CardTitle>
            <CardDescription>
              You may need to sign in or request access
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">
                <Home className="size-4" />
                Go Home
              </Link>
            </Button>
            <BackButton />
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-sm">
          <p>
            Need help?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
