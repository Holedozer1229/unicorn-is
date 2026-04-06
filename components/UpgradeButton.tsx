"use client"

export function UpgradeButton({ tier }: { tier: string }) {
  const handleUpgrade = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ tier }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      className="px-4 py-2 rounded-lg bg-black text-white"
    >
      Upgrade to {tier}
    </button>
  )
}
