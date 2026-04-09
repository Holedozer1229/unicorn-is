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
import { LayoutDashboard, Lightbulb, Calendar, DollarSign, BarChart3, Settings, Crown, Zap, MessageCircle } from "lucide-react"
import UnicornOSLogo from "@/components/ui/UnicornOSLogo"

interface SidebarProps { user: User; profile: Profile | null; subscription: Subscription | null }

const navItems = [
  { title: "Dashboard",      href: "/dashboard",              icon: LayoutDashboard },
  { title: "Content Engine", href: "/dashboard/content",      icon: Lightbulb },
  { title: "Sphinx Oracle",  href: "/dashboard/sphinx-chat",  icon: MessageCircle },
  { title: "Planner",        href: "/dashboard/planner",      icon: Calendar },
  { title: "Monetization",   href: "/dashboard/monetization", icon: DollarSign },
  { title: "Analytics",      href: "/dashboard/analytics",    icon: BarChart3 },
  { title: "Settings",       href: "/dashboard/settings",     icon: Settings },
]

export function DashboardSidebar({ user, profile, subscription }: SidebarProps) {
  const pathname = usePathname()
  const tier = subscription?.tier || "free"
  const limits = TIER_LIMITS[tier]

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[rgba(0,200,255,0.12)] bg-[rgba(4,4,15,0.95)] backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center border-b border-[rgba(0,200,255,0.12)] px-4">
        <UnicornOSLogo size={28} />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[rgba(0,200,255,0.12)] text-[#00d4ff] border border-[rgba(0,200,255,0.25)] shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                  : "text-white/50 hover:bg-[rgba(255,255,255,0.04)] hover:text-white/80"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[rgba(0,200,255,0.12)] p-4">
        <div className="rounded-xl bg-[rgba(0,200,255,0.05)] border border-[rgba(0,200,255,0.1)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">
              {tier === "free" ? "Free Plan" : tier === "creator" ? "Creator" : "Pro"}
            </span>
            <Badge className={cn("text-xs", tier === "pro" ? "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30" : "bg-[rgba(0,200,255,0.1)] text-[#00d4ff] border-[rgba(0,200,255,0.3)]" )}>
              {tier === "pro" && <Crown className="mr-1 h-3 w-3" />}
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Badge>
          </div>
          {tier !== "pro" && (
            <>
              <div className="mb-2 flex items-center justify-between text-xs text-white/40">
                <span>AI Generations</span>
                <span>0 / {limits.aiGenerationsPerMonth}</span>
              </div>
              <Progress value={0} className="mb-3 h-1" />
              <Button asChild size="sm" className="w-full bg-[#00d4ff] hover:bg-[#00bde8] text-[#04040f] font-bold rounded-lg shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                <Link href="/dashboard/settings?tab=billing">
                  <Zap className="mr-2 h-3 w-3" /> Upgrade Plan
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
