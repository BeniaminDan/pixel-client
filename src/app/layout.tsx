import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppFooter, AppHeader } from "@/components";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Client",
  description: "Foundational UI shell for Pixel experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <AppHeader isStickyEnabled={true} />
            <main className="flex-1">
              {children}
            </main>
            <AppFooter />
            <CookieConsent />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
