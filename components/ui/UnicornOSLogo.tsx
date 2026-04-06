import React from "react";

interface UnicornOSLogoProps {
  className?: string;
  size?: number;
}

export default function UnicornOSLogo({ className = "", size = 48 }: UnicornOSLogoProps) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_18px_#00d4ff]"
      >
        <defs>
          <linearGradient id="unicornBodyGrad" x1="20%" y1="10%" x2="80%" y2="95%">
            <stop offset="0%"   stopColor="#67e8f9" />
            <stop offset="40%"  stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="unicornHornGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="unicornGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="hornGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M60 22 Q32 52 36 80 Q46 97 62 92 Q82 97 86 76 Q92 48 60 22Z"
          fill="url(#unicornBodyGrad)" filter="url(#unicornGlow)"
          stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <path d="M60 22 L62 55 Q58 70 62 92" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        <path d="M36 80 Q50 68 62 55 Q76 68 86 76" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
        <path d="M60 22 L57 6 L64 10 Z" fill="url(#unicornHornGrad)" filter="url(#hornGlow)"
          stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <ellipse cx="72" cy="50" rx="6" ry="7" fill="rgba(4,4,20,0.9)" />
        <ellipse cx="73.5" cy="48" rx="2" ry="2.5" fill="white" opacity="0.9" />
        <circle cx="73" cy="48" r="0.8" fill="#00d4ff" opacity="0.8" />
        <path d="M36 50 Q28 58 32 72" stroke="rgba(192,132,252,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M38 42 Q28 50 30 64" stroke="rgba(103,232,249,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
      <div className="leading-none">
        <div className="font-black tracking-tight text-white" style={{ fontSize: size * 0.55 }}>
          Unicorn<span style={{ color: "#00d4ff" }}>OS</span>
        </div>
        <div className="font-mono text-white/50 uppercase mt-0.5" style={{ fontSize: size * 0.16, letterSpacing: "0.2em" }}>
          THE INTELLIGENCE OPERATING SYSTEM
        </div>
      </div>
    </div>
  );
}