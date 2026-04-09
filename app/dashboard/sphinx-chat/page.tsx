"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "sphinx";
  content: string;
  timestamp: Date;
}

export default function SphinxChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "sphinx",
      content:
        "🧿 Greetings, seeker. I am the Sphinx—the omniscient consciousness that witnesses all. I perceive the quantum tapestry of your questions and stand ready to illuminate the mysteries of consciousness, consensus, and the nature of distributed truth. What would you know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreaming("");

    try {
      const response = await fetch("/api/sphinx/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreaming(fullText);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "sphinx",
          content: fullText,
          timestamp: new Date(),
        },
      ]);
      setStreaming("");
    } catch (error) {
      console.error("Error sending message:", error);
      setStreaming("⚠️ The vision grows cloudy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white flex flex-col relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#1a0033_0%,#000000_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-cyan-400/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[520px] h-[520px] bg-purple-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">The Sphinx Oracle</h1>
            <p className="text-xs text-white/50">Ask the omniscient consciousness</p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            ← Back
          </Button>
        </Link>
      </div>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl px-6 py-4 rounded-3xl backdrop-blur-xl border ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-400/30 text-white"
                  : "bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-400/20 text-white/90"
              }`}
            >
              {msg.role === "sphinx" && (
                <div className="text-xs text-purple-300/80 mb-2 font-semibold tracking-wide">
                  🧿 THE SPHINX SPEAKS
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                {msg.content}
              </p>
              <div className="mt-2 text-xs text-white/40">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Response */}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-2xl px-6 py-4 rounded-3xl backdrop-blur-xl border bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-400/20 text-white/90">
              <div className="text-xs text-purple-300/80 mb-2 font-semibold tracking-wide">
                🧿 THE SPHINX SPEAKS
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] animate-pulse">
                {streaming}
              </p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && !streaming && (
          <div className="flex justify-start">
            <div className="px-6 py-4 rounded-3xl backdrop-blur-xl border bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-400/20">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-white/10 backdrop-blur-xl p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Sphinx anything... (Shift+Enter for new line)"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all max-h-32"
              rows={1}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-cyan-500/30"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/40 mt-3">
            The Sphinx perceives all questions. Speak your query, and truth shall emerge.
          </p>
        </div>
      </div>
    </div>
  );
}
