"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile, Subscription } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TIER_LIMITS } from "@/lib/types"
import {
  LayoutDashboard,
  Lightbulb,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react"

interface SidebarProps {
  user: User
  profile: Profile | null
  subscription: Subscription | null
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content Engine",
    href: "/dashboard/content",
    icon: Lightbulb,
  },
  {
    title: "Planner",
    href: "/dashboard/planner",
    icon: Calendar,
  },
  {
    title: "Monetization",
    href: "/dashboard/monetization",
    icon: DollarSign,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar({
  user,
  profile,
  subscription,
}: SidebarProps) {
  const pathname = usePathname()
  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">CreatorOS</span>
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              {tier === "free" ? "Free Plan" : tier === "creator" ? "Creator" : "Pro"}
            </span>
            <Badge
              variant={tier === "pro" ? "default" : "secondary"}
              className="text-xs"
            >
              {tier === "pro" && <Crown className="mr-1 h-3 w-3" />}
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Badge>
          </div>

          {tier !== "pro" && (
            <>
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>AI Generations</span>
                <span>0 / {limits.aiGenerationsPerMonth}</span>
              </div>
              <Progress value={0} className="mb-3 h-1.5" />

              <Button asChild size="sm" className="w-full">
                <Link href="/dashboard/settings?tab=billing">
                  <Zap className="mr-2 h-3 w-3" />
                  Upgrade Plan
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
