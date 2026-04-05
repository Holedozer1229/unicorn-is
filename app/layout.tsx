import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "CreatorOS - AI-Powered Creator Growth Platform",
  description:
    "Your all-in-one platform for AI-powered content ideas, scheduling, monetization strategies, and analytics. Grow your creator business with intelligent tools.",
  keywords: [
    "creator tools",
    "content creation",
    "AI content",
    "social media management",
    "monetization",
    "analytics",
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
