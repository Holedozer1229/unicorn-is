"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface UnicornLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

export function UnicornLogo({ size = "md", showText = true, className }: UnicornLogoProps) {
  const dimension = sizeMap[size]
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Image
          src="/images/unicorn-logo.jpg"
          alt="CreatorOS Logo"
          width={dimension}
          height={dimension}
          className="rounded-lg"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-pink-500/20 to-violet-500/20 pointer-events-none" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent",
            size === "sm" && "text-sm",
            size === "md" && "text-lg",
            size === "lg" && "text-xl",
            size === "xl" && "text-2xl"
          )}>
            CreatorOS
          </span>
          {(size === "md" || size === "lg" || size === "xl") && (
            <span className="text-xs text-muted-foreground">For Creators Who Hustle</span>
          )}
        </div>
      )}
    </div>
  )
}

// SVG version for inline use without image dependency
export function UnicornIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="unicornGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="hornGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>
      {/* Unicorn head silhouette */}
      <path
        d="M36 32C36 32 38 28 38 24C38 18 34 14 28 12C28 12 30 8 28 4C28 4 22 8 20 12C14 14 10 18 10 26C10 32 14 38 22 40C22 40 26 42 32 40C32 40 36 38 36 32Z"
        fill="url(#unicornGradient)"
      />
      {/* Horn */}
      <path
        d="M28 12L24 2L22 12"
        stroke="url(#hornGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Sparkle on horn */}
      <circle cx="24" cy="6" r="1.5" fill="#fef3c7" />
      {/* Eye */}
      <circle cx="22" cy="24" r="2" fill="white" />
      {/* Mane accent */}
      <path
        d="M32 16C32 16 36 18 38 22"
        stroke="url(#unicornGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 14C30 14 34 14 38 18"
        stroke="url(#unicornGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}
