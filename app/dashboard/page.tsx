"use client";

import { useEffect, useState, useCallback } from "react";
import UnicornOSLogo from "@/components/ui/UnicornOSLogo";
import { generateShareText } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client"; // Adjust path if your Supabase client is elsewhere

export default function UnicornOSDashboard() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [streamedText, setStreamedText] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<'free' | 'creator' | 'pro'>('free');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const supabase = createClient();

  // Fetch user data (including stripe_customer_id and tier) on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Redirect to login if needed
          window.location.href = "/auth/login";
          return;
        }

        // Fetch profile with stripe_customer_id and tier
        const { data: profile } = await supabase
          .from('profiles') // or 'users' table – adjust to your schema
          .select('stripe_customer_id, tier')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCustomerId(profile.stripe_customer_id || null);
          setUserTier((profile.tier as 'free' | 'creator' | 'pro') || 'free');
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUserData();
  }, [supabase]);

  const steps = [
    "Scanning attention graphs...",
    "Mapping emotional hooks...",
    "Simulating audience reaction...",
    "Running virality model v9...",
    "Finalizing holographic prediction..."
  ];

  const runSimulation = useCallback(async () => {
    if (!idea.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setStreamedText("");
    setStep(0);
    setAnimatedScore(0);

    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise((resolve) => setTimeout(resolve, 620));
    }

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setStreamedText(buffer);
      }

      const finalData = JSON.parse(buffer.split("\n\n").pop() || "{}");
      setResult(finalData);
    } catch (error) {
      console.error("Simulation error:", error);
      setStreamedText("Error processing your idea. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [idea, loading]);

  useEffect(() => {
    if (!result?.score) return;

    let current = 0;
    const target = Math.floor(result.score);
    const interval = setInterval(() => {
      current += Math.max(2, Math.floor((target - current) / 6));
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 32);

    return () => clearInterval(interval);
  }, [result]);

  const shareText = result?.score ? generateShareText(result.score) : "";

  // Open Stripe Customer Portal
  const openBillingPortal = async () => {
    if (!customerId) {
      alert("No billing account linked. Please upgrade to Creator or Pro.");
      return;
    }

    if (userTier === 'free') {
      alert("Upgrade to Creator or Pro to manage billing.");
      return;
    }

    try {
      const res = await fetch("/api/webhook/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal.");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Unable to open billing portal at this time.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white overflow-hidden relative font-sans">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#1a0033_0%,#000000_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-cyan-400/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[520px] h-[520px] bg-purple-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-6 border-b border-white/10 backdrop-blur-lg">
        <UnicornOSLogo size={52} />

        <div className="flex items-center gap-5">
          <div className="hidden sm:block px-4 py-1 text-xs tracking-widest border border-cyan-400/30 rounded-full text-cyan-400">PRIVATE BETA</div>
          <button 
            onClick={openBillingPortal}
            disabled={isLoadingUser}
            className="px-6 py-2.5 text-sm font-medium border border-white/30 hover:border-cyan-400 rounded-2xl transition-all active:bg-cyan-400/10 disabled:opacity-50"
          >
            Manage Billing
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-none mb-6">
            See if your idea will{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">go viral</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
            Real-time audience simulation powered by SphinxOS and Holographic QAOA
          </p>
        </div>

        {/* Input Panel */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-950/90 border border-cyan-400/20 rounded-3xl p-8 sm:p-12 backdrop-blur-2xl shadow-2xl">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your next viral idea in detail..."
              className="w-full h-40 bg-transparent resize-none outline-none text-lg placeholder:text-white/50 leading-relaxed"
              disabled={loading}
            />

            <button
              onClick={runSimulation}
              disabled={loading || !idea.trim()}
              className="mt-10 w-full py-5 rounded-2xl font-semibold text-lg tracking-wider
                bg-gradient-to-r from-cyan-500 via-purple-600 to-violet-600 
                hover:brightness-110 active:scale-[0.985] transition-all duration-300 shadow-lg shadow-cyan-500/30
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "RUNNING HOLOGRAPHIC SIMULATION..." : "⚡ RUN VIRAL SIMULATION"}
            </button>

            {loading && (
              <div className="mt-8 font-mono text-cyan-400 text-sm tracking-[2px] text-center">
                ▶ {steps[step]}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(streamedText || result) && (
          <div className="mt-16 max-w-4xl mx-auto space-y-10">
            {streamedText && (
              <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-10 text-white/80 leading-relaxed text-[15px] backdrop-blur-xl">
                {streamedText}
              </div>
            )}

            {result && (
              <div className="border border-cyan-400/30 bg-gradient-to-br from-zinc-950 to-black rounded-3xl p-14 text-center backdrop-blur-2xl">
                <div className="uppercase tracking-[4px] text-xs text-cyan-400/80 mb-2">VIRALITY PREDICTION SCORE</div>
                <div className="text-[128px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-purple-300">
                  {animatedScore}
                </div>
                <div className="text-3xl text-white/50 -mt-6">/ 100</div>

                {animatedScore >= 85 && (
                  <div className="mt-8 text-3xl font-medium text-green-400 animate-pulse">🔥 HIGH VIRAL POTENTIAL DETECTED</div>
                )}
              </div>
            )}

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-950/80 border border-purple-400/20 rounded-3xl p-10">
                  <div className="text-purple-400 font-semibold mb-4 text-lg">Holographic Insight</div>
                  <p className="text-white/80 leading-relaxed">{result.insight || "Structural coherence analyzed via holographic regularization."}</p>
                </div>

                <div className="bg-zinc-950/80 border border-cyan-400/20 rounded-3xl p-10">
                  <div className="text-cyan-400 font-semibold mb-4 text-lg">Recommended Viral Upgrades</div>
                  <ul className="space-y-4 text-white/80 text-[15px]">
                    {result.improvements?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3">• {item}</li>
                    )) || <li>Advanced upgrades available in Creator and Pro tiers.</li>}
                  </ul>
                </div>
              </div>
            )}

            {result && (
              <div className="text-center pt-8">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText);
                    alert("Share text copied to clipboard");
                  }}
                  className="px-12 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-white/90 transition flex items-center gap-3 mx-auto active:scale-95"
                >
                  🚀 Share Result
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-white/40 pb-12">
        UNICORN OS • THE INTELLIGENCE OPERATING SYSTEM • POWERED BY SPHINXOS + HOLOGRAPHIC QAOA
      </div>
    </div>
  );
}
