"use client"

import React, { useId } from "react"

interface UnicornOSLogoProps {
  className?: string
  size?: number
}

export default function UnicornOSLogo({ className = "", size = 48 }: UnicornOSLogoProps) {
  const uid = useId().replace(/:/g, "_")
  const bodyGrad = "ubg_" + uid
  const hornGrad = "uhg_" + uid
  const glowFilt = "ugf_" + uid
  const hornFilt = "uhf_" + uid
  const ts = Math.round(size * 0.54)
  const ss = Math.max(7, Math.round(size * 0.155))
  return (
    <div className={"flex items-center gap-3 " + className} style={{ lineHeight: 1 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 10px #00d4ff88)" }}>
        <defs>
          <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="45%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id={hornGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <filter id={glowFilt} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={hornFilt} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M25 72 Q18 55 24 38 Q30 22 50 18 L50 50 Z" fill={"url(#"+bodyGrad+")"} opacity="0.75" />
        <path d="M50 18 Q68 20 74 38 Q80 55 72 70 L50 50 Z" fill={"url(#"+bodyGrad+")"} opacity="0.9" />
        <path d="M25 72 L50 50 L72 70 Q62 88 50 86 Q37 88 25 72 Z" fill={"url(#"+bodyGrad+")"} opacity="0.8" />
        <path d="M50 18 L50 50 L72 70 Q68 20 50 18 Z" fill="rgba(255,255,255,0.12)" />
        <path d="M25 72 L50 50 L25 38" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none" />
        <path d="M50 18 L50 50 L72 70" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" fill="none" />
        <path d="M50 50 L25 72 L50 86" stroke="rgba(103,232,249,0.3)" strokeWidth="0.6" fill="none" />
        <path d="M46 18 L50 2 L54 18 Z" fill={"url(#"+hornGrad+")"} filter={"url(#"+hornFilt+")"} />
        <line x1="50" y1="3" x2="50" y2="17" stroke="rgba(255,255,255,0.6)" strokeWidth="0.7" />
        <ellipse cx="63" cy="44" rx="5" ry="6" fill="rgba(4,4,20,0.92)" />
        <ellipse cx="64" cy="42" rx="1.8" ry="2" fill="white" opacity="0.95" />
        <circle cx="63.5" cy="42" r="0.7" fill="#00d4ff" />
        <path d="M26 38 Q16 48 18 62" stroke="rgba(192,132,252,0.55)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M24 45 Q14 54 16 68" stroke="rgba(103,232,249,0.35)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="82" cy="22" r="1.2" fill="#fbbf24" opacity="0.9" />
        <circle cx="88" cy="35" r="0.8" fill="#00d4ff" opacity="0.8" />
        <circle cx="15" cy="30" r="1" fill="#c084fc" opacity="0.7" />
        <circle cx="80" cy="60" r="0.7" fill="#67e8f9" opacity="0.6" />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: ts, fontWeight: 900, letterSpacing: "-0.03em", color: "white" }}>
          Unicorn<span style={{ color: "#00d4ff" }}>OS</span>
        </div>
        <div style={{ fontSize: ss, fontWeight: 500, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", fontFamily: "monospace", marginTop: 2, textTransform: "uppercase" }}>
          THE INTELLIGENCE OPERATING SYSTEM
        </div>
      </div>
    </div>
  )
}