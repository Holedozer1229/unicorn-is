"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  Briefcase,
  Sparkles,
  BarChart3,
  CreditCard,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Content Strategy Generator",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Growth Metrics",
  },
  {
    title: "Market",
    href: "/market",
    icon: Store,
    description: "Discover Creators",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    description: "Track Investments",
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    description: "Plans & Usage",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-gradient">CreatorOS</span>
          <p className="text-xs text-muted-foreground">AI Growth Engine</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <div>
                <p>{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="gradient-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Powered Platform
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Generate viral content strategies, discover top creators, and optimize your monetization.
          </p>
        </div>
      </div>
    </aside>
  )
}
