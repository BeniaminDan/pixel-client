import { AppFooter, AppHeader } from "@/components";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader isStickyEnabled={true} />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
