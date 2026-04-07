"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Check, Zap, Crown, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import UnicornOSLogo from "@/components/ui/UnicornOSLogo"

function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [s, setS] = useState<React.CSSProperties>({})
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        setS({ transform: "perspective(800px) rotateY(" + (x * 12) + "deg) rotateX(" + (-y * 12) + "deg) scale3d(1.02,1.02,1.02)", transition: "transform 0.05s ease" })
      }}
      onMouseLeave={() => setS({ transform: "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)", transition: "transform 0.45s ease" })}
      style={{ ...style, ...s }}
      className={className}
    >
      {children}
    </div>
  )
}
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      let cur = 0
      const step = to / 55
      const t = setInterval(() => {
        cur = Math.min(cur + step, to)
        setVal(Math.floor(cur))
        if (cur >= to) clearInterval(t)
      }, 28)
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val >= 1000 ? (val / 1000).toFixed(val >= 100000 ? 0 : 1) + "K" : val}{suffix}</span>
}
const WORDS = ["Creators","Models","Influencers","Podcasters","Streamers","Artists"]

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 })
  const [wordIdx, setWordIdx] = useState(0)
  const [wordIn, setWordIn] = useState(true)

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", h)
    return () => window.removeEventListener("mousemove", h)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setWordIn(false)
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setWordIn(true) }, 380)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden" style={{ background: "#04040f" }}>

      {/* Mouse spotlight */}
      <div className="pointer-events-none fixed inset-0 z-30" style={{ background: "radial-gradient(700px circle at " + mouse.x + "px " + mouse.y + "px, rgba(0,212,255,0.06), transparent 42%)" }} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[rgba(0,200,255,0.1)] bg-[rgba(4,4,15,0.82)] backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/"><UnicornOSLogo size={32} /></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/45">
            {["Features", "Intelligence", "Pricing"].map(n => (
              <Link key={n} href={"#" + n.toLowerCase()} className="hover:text-[#00d4ff] transition-colors tracking-wide font-mono text-xs uppercase">{n}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-white/55 hover:text-white hover:bg-white/5 text-sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-[#00d4ff] hover:bg-[#00bde8] text-[#04040f] font-bold rounded-full px-5 text-sm shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-all">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="particle-field relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

          {/* Scan line */}
          <div className="scan-line" aria-hidden="true" />

          {/* Particles */}
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="particle" style={{ left: ((i * 37 + 11) % 100) + "%", animationDelay: (i * 0.38) + "s", animationDuration: (8 + (i % 7)) + "s" }} />
          ))}

          {/* Nebula blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/4 w-[750px] h-[600px] rounded-full bg-[#00d4ff]/7 blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[650px] h-[500px] rounded-full bg-[#8b5cf6]/7 blur-[130px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-[#fbbf24]/4 blur-[100px]" />
          </div>

          {/* Circuit grid */}
          <div className="circuit-grid pointer-events-none absolute inset-0 opacity-25" />

          {/* Galaxy ring */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-0">
            <div className="w-[900px] h-[350px] rounded-full border border-[rgba(0,200,255,0.06)]" style={{ transform: "rotateX(72deg)", boxShadow: "0 0 100px rgba(0,200,255,0.04) inset" }} />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-36">

            
            {/* ── HERO CINEMATIC LOGO EMBLEM ── */}
            <div className="relative flex flex-col items-center" style={{ paddingTop:"60px", paddingBottom:"40px", marginBottom:"2rem" }}>

              {/* Outer slow orbit ring — true-centered on logo */}
              <div className="logo-orbit-b absolute rounded-full border border-[rgba(0,200,255,0.08)]" style={{ width:"640px", height:"640px", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />

              {/* Inner faster orbit ring with dots — true-centered */}
              <div className="logo-orbit-a absolute rounded-full border border-[rgba(0,200,255,0.16)]" style={{ width:"460px", height:"460px", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-[#00d4ff] shadow-[0_0_14px_#00d4ff]"/>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#c084fc] shadow-[0_0_10px_#c084fc]"/>
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-2 w-2 rounded-full bg-[#fbbf24] shadow-[0_0_10px_#fbbf24]"/>
              </div>

              {/* Cinematic glow bloom behind logo */}
              <div className="absolute pointer-events-none" style={{ width:"560px", height:"400px", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, rgba(0,212,255,0.18) 45%, transparent 70%)", filter:"blur(40px)" }} />

              {/* The Cinematic Logo */}
              <div className="relative z-10 unicorn-float" style={{ filter:"drop-shadow(0 0 70px rgba(0,212,255,0.55)) drop-shadow(0 25px 55px rgba(124,58,237,0.45))" }}>
                <UnicornOSLogo size={240} iconOnly={true} />
              </div>

            </div>

            {/* Platform pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {["YouTube","OnlyFans","TikTok","Instagram","Twitch","Patreon"].map(pl=>(
                <span key={pl} className="px-3 py-1 text-[10px] font-mono tracking-wider rounded-full border border-white/10 text-white/30 bg-white/[0.03] uppercase">{pl}</span>
              ))}
            </div>

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,255,0.28)] bg-[rgba(0,200,255,0.07)] mb-10 text-xs font-mono tracking-[0.2em] text-[#00d4ff] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]" />
              </span>
              42,000+ Creators Already Inside
            </div>

            {/* Headline */}
            <h1 className="mx-auto mb-4 max-w-5xl font-black tracking-tight leading-[1.04]" style={{ fontSize: "clamp(2.8rem,8vw,6.5rem)" }}>
              <span className="text-white block">The OS Built For</span>
              <span
                className="text-gradient block"
                style={{ display:"block", opacity: wordIn ? 1 : 0, transform: wordIn ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.38s ease, transform 0.38s ease" }}
              >
                {WORDS[wordIdx]}
              </span>
            </h1>

            <p className="mx-auto mb-3 max-w-2xl font-semibold text-white/65 leading-snug" style={{ fontSize: "clamp(1.1rem,2.2vw,1.35rem)" }}>Post everywhere. Earn everywhere. Automate everything.</p>
            <p className="mx-auto mb-12 max-w-xl text-white/35 leading-relaxed text-base">UnicornOS is the AI engine powering creators on YouTube, OnlyFans, TikTok, Instagram, Twitch and beyond — turning your content into a real, scalable business.</p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button asChild size="lg" className="group bg-[#00d4ff] hover:bg-[#00bde8] text-[#04040f] font-black text-base rounded-full px-10 h-14 shadow-[0_0_40px_rgba(0,212,255,0.5)] hover:shadow-[0_0_65px_rgba(0,212,255,0.75)] transition-all hover:scale-105">
                <Link href="/auth/sign-up">Launch Your OS Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white/55 hover:text-white rounded-full px-8 h-14 border border-white/10 hover:border-[rgba(0,200,255,0.3)] hover:bg-[rgba(0,200,255,0.04)] transition-all">
                <Link href="#features"><Play className="mr-2 h-4 w-4 fill-current" /> See How It Works</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
              <div className="flex -space-x-2">
                {["#00d4ff","#c084fc","#34d399","#fbbf24","#f472b6"].map((col,i)=>(
                  <div key={i} className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-[9px] font-black" style={{background:"linear-gradient(135deg,"+col+"33,"+col+"11)",borderColor:col+"55",color:col}}>{["YT","OF","TK","IG","TW"][i]}</div>
                ))}
              </div>
              <span className="text-white/30 text-xs font-mono">Join 42,000+ creators already earning more</span>
              <span className="text-[#34d399] text-xs font-mono font-bold">&#8593; $18M+ generated</span>
            </div>

            {/* Live HUD metrics */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { v: "42K+",  l: "Active Creators",  c: "#00d4ff" },
                { v: "$18M+", l: "Revenue Generated", c: "#fbbf24" },
                { v: "50+",   l: "Platforms",         c: "#a78bfa" },
                { v: "99.9%", l: "Uptime",            c: "#34d399" },
              ].map(({ v, l, c }) => (
                <div key={l} className="hud-card flex items-center gap-3 px-5 py-3 rounded-2xl">
                  <span className="text-xl font-black font-mono" style={{ color: c }}>{v}</span>
                  <span className="text-[10px] font-mono tracking-[0.15em] text-white/35 uppercase">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 animate-bounce">
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
          </div>
        </section>
        {/* ── MARQUEE ── */}
        <div className="border-y border-[rgba(0,200,255,0.09)] bg-[rgba(0,200,255,0.02)] py-4 overflow-hidden">
          <div className="marquee-track gap-10">
            {["OnlyFans Creators","YouTubers","Podcasters","TikTokers","Instagram Models","Twitch Streamers","Adult Creators","Course Creators","Brand Builders","Music Artists","Fitness Models","Agencies","OnlyFans Creators","YouTubers","Podcasters","TikTokers","Instagram Models","Twitch Streamers","Adult Creators","Course Creators","Brand Builders","Music Artists","Fitness Models","Agencies"].map((t, i) => (
              <span key={i} className="shrink-0 flex items-center gap-4 text-xs font-mono tracking-widest text-white/30 uppercase whitespace-nowrap">
                <span className="text-[#00d4ff]/35 text-[8px]">&#9670;</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="features" className="py-28 relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-0 w-px h-40 bg-gradient-to-b from-transparent via-[rgba(0,200,255,0.2)] to-transparent" />
            <div className="absolute top-1/2 right-0 w-px h-40 bg-gradient-to-b from-transparent via-[rgba(0,200,255,0.2)] to-transparent" />
          </div>
          <div className="container mx-auto px-4">
            <div className="mb-20 text-center">
              <p className="text-[11px] font-mono tracking-[0.35em] text-[#00d4ff] uppercase mb-5">Core Modules</p>
              <h2 className="font-black tracking-tight text-white mb-5" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
                Built for <span className="text-gradient">Every Creator</span>
              </h2>
              <p className="max-w-lg mx-auto text-white/40 leading-relaxed">Every platform. Every niche. Every creator type. One AI-powered OS to rule them all.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "&#9889;", title: "Content Engine",   tag: "GENERATE", desc: "Unlimited content ideas for every platform — YouTube, TikTok, OnlyFans, Instagram. Never run dry again.",                 c: "#00d4ff", stat: "10K ideas/mo" },
                { icon: "&#128197;", title: "Smart Planner",    tag: "SCHEDULE", desc: "Schedule across all your platforms at once. AI posts at peak engagement times on every channel.",      c: "#34d399", stat: "50+ platforms" },
                { icon: "&#128176;", title: "Monetization AI",  tag: "REVENUE",  desc: "Fan subscriptions, brand deals, tips, PPV — AI reveals your highest-earning opportunities across every platform.",    c: "#fbbf24", stat: "$18M generated" },
                { icon: "&#128202;", title: "Growth Analytics", tag: "ANALYZE",  desc: "Track subscribers, revenue, and engagement across all platforms in one dashboard. Know exactly what earns.",     c: "#a78bfa", stat: "99% accuracy" },
              ].map(({ icon, title, tag, desc, c, stat }) => (
                <TiltCard key={title}
                  style={{ borderColor: c + "22" }}
                  className="cosmic-card rounded-2xl p-6 cursor-default group"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: c + "14", border: "1px solid " + c + "30" }} dangerouslySetInnerHTML={{ __html: icon }} />
                    <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full" style={{ color: c, background: c + "14", border: "1px solid " + c + "28" }}>{tag}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-6">{desc}</p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">Live Stat</span>
                    <span className="text-xs font-mono font-bold" style={{ color: c }}>{stat}</span>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
        {/* ── STATS ── */}
        <section id="intelligence" className="relative py-24 overflow-hidden" style={{ background: "rgba(0,200,255,0.02)", borderTop: "1px solid rgba(0,200,255,0.08)", borderBottom: "1px solid rgba(0,200,255,0.08)" }}>
          <div className="circuit-grid pointer-events-none absolute inset-0 opacity-15" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { to: 42000,   suf: "+",  label: "Active Creators"    },
                { to: 2400000, suf: "+",  label: "Posts Scheduled"    },
                { to: 18, suf: "M+", label: "Creator Revenue" },
                { to: 99,      suf: ".9%",label: "Platform Uptime"    },
              ].map(({ to, suf, label }) => (
                <div key={label}>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">
                    <Counter to={to} suffix={suf} />
                  </div>
                  <div className="text-xs text-white/35 tracking-widest uppercase font-mono">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-28 relative">
          <div className="container mx-auto px-4">
            <div className="mb-20 text-center">
              <p className="text-[11px] font-mono tracking-[0.35em] text-[#fbbf24] uppercase mb-5">Pricing</p>
              <h2 className="font-black tracking-tight text-white" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
                Start Free. <span className="text-gradient">Scale Fast.</span>
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 items-start">

              <TiltCard className="cosmic-card rounded-2xl p-8">
                <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-1">Starter</p>
                <h3 className="text-xl font-bold text-white mb-6">Free</h3>
                <div className="mb-7 font-mono"><span className="text-5xl font-black text-white">$0</span><span className="text-white/25 ml-1 text-sm">/mo</span></div>
                <ul className="space-y-3.5 text-sm mb-8">
                  {["10 AI generations/mo","25 saved ideas","5 scheduled posts","7-day analytics"].map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-white/50"><Check className="h-4 w-4 text-[#34d399] shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full border-white/10 text-white/50 hover:border-[#00d4ff]/40 hover:text-[#00d4ff] rounded-xl transition-all h-11">
                  <Link href="/auth/sign-up">Get Started Free</Link>
                </Button>
              </TiltCard>

              <TiltCard className="rounded-2xl p-8 relative" style={{ background: "linear-gradient(145deg,rgba(0,212,255,0.07),rgba(0,200,255,0.02))", border: "1px solid rgba(0,200,255,0.35)", boxShadow: "0 0 60px rgba(0,212,255,0.12),inset 0 0 40px rgba(0,212,255,0.03)" }}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#00d4ff] text-[#04040f] shadow-[0_0_25px_rgba(0,212,255,0.65)]">
                    <Zap className="h-3 w-3 fill-current" /> MOST POPULAR
                  </span>
                </div>
                <p className="text-[10px] font-mono tracking-widest text-[#00d4ff] uppercase mb-1">Creator</p>
                <h3 className="text-xl font-bold text-white mb-6">Creator</h3>
                <div className="mb-7 font-mono"><span className="text-5xl font-black text-white">$19</span><span className="text-white/25 ml-1 text-sm">/mo</span></div>
                <ul className="space-y-3.5 text-sm mb-8">
                  {["100 AI generations/mo","250 saved ideas","50 scheduled posts","30-day analytics","Monetization AI"].map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-white/60"><Check className="h-4 w-4 text-[#00d4ff] shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-[#00d4ff] hover:bg-[#00bde8] text-[#04040f] font-black rounded-xl h-11 shadow-[0_0_25px_rgba(0,212,255,0.45)] hover:shadow-[0_0_45px_rgba(0,212,255,0.65)] transition-all">
                  <Link href="/auth/sign-up">Start Creating</Link>
                </Button>
              </TiltCard>

              <TiltCard className="cosmic-card rounded-2xl p-8" style={{ borderColor: "rgba(251,191,36,0.2)" }}>
                <p className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase mb-1">Professional</p>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Crown className="h-4 w-4 text-[#fbbf24]" /> Pro</h3>
                <div className="mb-7 font-mono"><span className="text-5xl font-black text-white">$49</span><span className="text-white/25 ml-1 text-sm">/mo</span></div>
                <ul className="space-y-3.5 text-sm mb-8">
                  {["Unlimited AI generations","Unlimited ideas and posts","1-year analytics history","Advanced monetization AI","Priority support"].map(f=>(
                    <li key={f} className="flex items-center gap-2.5 text-white/60"><Check className="h-4 w-4 text-[#fbbf24] shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full border-[rgba(251,191,36,0.3)] text-[#fbbf24] hover:bg-[rgba(251,191,36,0.08)] hover:border-[#fbbf24] rounded-xl h-11 transition-all">
                  <Link href="/auth/sign-up">Go Pro</Link>
                </Button>
              </TiltCard>

            </div>
          </div>
        </section>
        {/* ── CTA ── */}
        <section className="relative py-36 overflow-hidden">
          {/* Orbiting rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="orbit-ring w-[900px] h-[900px] rounded-full border border-[rgba(0,200,255,0.04)]" />
            <div className="orbit-ring w-[680px] h-[680px] rounded-full border border-[rgba(0,200,255,0.06)]" style={{ animationDirection: "reverse", animationDuration: "28s" }} />
            <div className="orbit-ring w-[460px] h-[460px] rounded-full border border-[rgba(0,200,255,0.09)]" style={{ animationDuration: "18s" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 60%)" }} />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-[11px] font-mono tracking-[0.35em] text-[#00d4ff] uppercase mb-6">Join the Revolution</p>
            <h2 className="font-black tracking-tight text-white mb-6" style={{ fontSize: "clamp(2.5rem,6.5vw,5rem)" }}>
              Your Audience is<br />
              <span className="text-gradient">Waiting for You</span>
            </h2>
            <p className="mx-auto mb-14 max-w-md text-white/40 leading-relaxed text-lg">
              42,000+ creators — OnlyFans models, YouTubers, influencers, podcasters — are scaling faster with UnicornOS. Your turn.
            </p>
            <Button asChild size="lg" className="group bg-[#00d4ff] hover:bg-[#00bde8] text-[#04040f] font-black text-lg rounded-full px-14 h-16 shadow-[0_0_55px_rgba(0,212,255,0.55)] hover:shadow-[0_0_90px_rgba(0,212,255,0.78)] transition-all hover:scale-105">
              <Link href="/auth/sign-up">
                Start for Free
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="mt-8 text-[11px] text-white/20 font-mono tracking-widest uppercase">No credit card required &middot; Cancel anytime &middot; Instant access</p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[rgba(0,200,255,0.08)] py-8" style={{ background: "rgba(4,4,15,0.95)" }}>
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <UnicornOSLogo size={28} />
          <p className="text-xs text-white/20 font-mono">Built for creators, by creators. &copy; 2025 UnicornOS</p>
          <div className="flex items-center gap-1.5 text-xs text-white/20 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff] animate-pulse inline-block" />
            ALL SYSTEMS NOMINAL
          </div>
        </div>
      </footer>
    </div>
  )
}