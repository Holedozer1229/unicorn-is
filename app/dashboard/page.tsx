"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  async function run() {
    setLoading(true);
    setResult(null);
    setStep(0);
    setAnimatedScore(0);

    // fake “intelligence pipeline” feeling
    const steps = [
      "Scanning attention graphs...",
      "Mapping emotional hooks...",
      "Simulating audience reaction...",
      "Running virality model v9...",
      "Finalizing prediction..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }

    const res = await fetch("/api/score", {
      method: "POST",
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!result?.score) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= result.score) {
        i = result.score;
        clearInterval(interval);
      }
      setAnimatedScore(i);
    }, 18);

    return () => clearInterval(interval);
  }, [result]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* PREMIUM BACKGROUND FIELD */}
      <div className="absolute inset-0">
        <div className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[180px] top-[-200px] left-[-200px]" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-400/10 blur-[160px] bottom-[-200px] right-[-200px]" />
      </div>

      {/* TOP BAR */}
      <div className="relative flex justify-between items-center px-6 py-5 border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">
          🦄 Unicorn OS
        </div>

        <div className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/60">
          PRIVATE BETA • INVITE ONLY
        </div>
      </div>

      {/* HERO */}
      <div className="relative px-6 pt-14 max-w-3xl">

        <h1 className="text-5xl font-bold leading-tight">
          See if your idea will{" "}
          <span className="text-cyan-400">go viral</span>
          <br />
          before you post it.
        </h1>

        <p className="text-white/60 mt-4 text-lg">
          Unicorn OS simulates audience attention across TikTok, Reels, and Shorts in real-time.
        </p>

        {/* STATUS SIGNAL */}
        <div className="mt-6 text-xs text-cyan-300">
          ⚡ You are in the top 3% of early users
        </div>
      </div>

      {/* INPUT CARD */}
      <div className="relative px-6 mt-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your next viral idea..."
            className="w-full h-28 bg-transparent outline-none resize-none text-lg"
          />

          <button
            onClick={run}
            className="mt-4 w-full py-3 rounded-xl font-semibold
            bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-400
            hover:scale-[1.01] transition"
          >
            ⚡ Run Viral Simulation
          </button>

          {/* LIVE PROCESS FEED */}
          {loading && (
            <div className="mt-4 text-sm text-white/60 space-y-1">
              <div>▶ {["Scanning attention graphs...",
                      "Mapping emotional hooks...",
                      "Simulating audience reaction...",
                      "Running virality model v9...",
                      "Finalizing prediction..."][step]}</div>
            </div>
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div className="relative px-6 mt-10 max-w-4xl">

          {/* SCORE CARD */}
          <div className="border border-white/10 bg-white/5 rounded-3xl p-10 text-center backdrop-blur-xl">

            <div className="text-sm text-white/50">
              VIRALITY PREDICTION SCORE
            </div>

            <div className="text-7xl font-extrabold text-cyan-300 mt-2">
              {animatedScore}
            </div>

            <div className="text-white/40">/ 100</div>

            {animatedScore > 85 && (
              <div className="mt-4 text-green-400 animate-pulse">
                🔥 HIGH VIRAL PROBABILITY DETECTED
              </div>
            )}

            {animatedScore < 40 && (
              <div className="mt-4 text-red-400">
                ⚠ Low engagement risk
              </div>
            )}
          </div>

          {/* INSIGHTS GRID */}
          <div className="grid md:grid-cols-2 gap-5 mt-6">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-purple-300 font-semibold mb-3">
                Why this works
              </div>
              <div className="space-y-2 text-white/70 text-sm">
                {result.reasons.map((r: string, i: number) => (
                  <div key={i}>• {r}</div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-cyan-300 font-semibold mb-3">
                Viral upgrades
              </div>
              <div className="space-y-2 text-white/70 text-sm">
                {result.improvements.map((r: string, i: number) => (
                  <div key={i}>• {r}</div>
                ))}
              </div>
            </div>
          </div>

          {/* VIRAL LOOP */}
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:scale-105 transition">
              🚀 Share Result
            </button>

            <p className="text-xs text-white/40 mt-3">
              Sharing unlocks advanced prediction models
            </p>
          </div>
        </div>
      )}

      {/* FOOTER STATUS LAYER */}
      <div className="relative mt-20 text-center text-xs text-white/30 pb-10">
        Unicorn OS • Attention Intelligence System • v0.1 Private Build
      </div>
    </div>
  );
}
