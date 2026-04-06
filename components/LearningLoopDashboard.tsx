"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LearningLoopDashboard() {
  const [log, setLog] = useState<any[]>([])

  async function simulate() {
    const res = await fetch("/api/learning/loop", {
      method: "POST",
      body: JSON.stringify({
        contentId: "test-1",
        content: "AI will replace creators",
        metrics: {
          impressions: 10000,
          likes: 300,
          shares: 80,
          comments: 40
        }
      })
    })

    const data = await res.json()
    setLog((prev) => [...prev, data])
  }

  return (
    <div className="space-y-4">

      <Button onClick={simulate}>
        Run Learning Cycle
      </Button>

      <div className="space-y-2">
        {log.map((l, i) => (
          <div key={i} className="p-3 border rounded-xl text-sm">
            <div>Score: {l.score}</div>
            <div>Action: {l.action}</div>
            <div>Next: {l.nextStep}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
