import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/globals.css"
import { CookieConsent } from "@/shared/ui/components/cookie-consent"
import { Toaster } from "@/shared/ui/reusable/sonner"
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { SessionProvider } from "@/shared/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Pixel Client",
  description: "Foundational UI shell for Pixel experiences",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <CookieConsent />
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
