import Link from 'next/link'
import { Home, Search } from 'lucide-react'

import { AppFooter, AppHeader } from '@/components'
import { BackButton } from '@/components/status-pages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/auth'

export default async function NotFound() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader isStickyEnabled={false} user={session?.user} />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
        <div className="container flex max-w-2xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />
              <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-6xl font-bold text-primary sm:size-32 sm:text-7xl">
                404
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Page Not Found
              </h1>
              <p className="text-muted-foreground text-lg">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>
          </div>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>What would you like to do?</CardTitle>
              <CardDescription>
                Here are some helpful links to get you back on track
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/">
                  <Home className="size-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/contact">
                  <Search className="size-4" />
                  Contact Support
                </Link>
              </Button>
              <BackButton />
            </CardContent>
          </Card>

          <div className="text-muted-foreground text-sm">
            <p>
              If you believe this is an error, please{' '}
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
