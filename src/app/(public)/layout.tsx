import { auth } from "@/lib/auth"
import { AppFooter } from "@/components"
import { StickyHeaderWrapper } from "@/components/layouts/sticky-header-wrapper"
import { ReactNode } from "react";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode
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

