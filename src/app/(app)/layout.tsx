import { auth } from "@/modules/auth/lib/auth"
import { AppFooter } from "@/components"
import { StickyHeaderWrapper } from "@/components/layouts/sticky-header-wrapper"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <StickyHeaderWrapper user={session?.user} />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}

