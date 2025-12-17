import { auth } from "@/auth"
import { AppFooter, AppHeader } from "@/components"

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader isStickyEnabled={true} user={session?.user} />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}
