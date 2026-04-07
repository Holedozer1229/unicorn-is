import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for conditionally joining class names.
 * Used extensively by shadcn/ui components (button, card, dialog, tooltip, etc.).
 * Combines clsx for conditional logic and tailwind-merge for conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates shareable text for viral score results.
 * Used in the dashboard for the "Share Result" feature.
 */
export function generateShareText(score: number): string {
  return `I just tested my idea on Unicorn OS (powered by SphinxOS + Holographic QAOA).

🔥 Optimized Viral Score: ${score}/100

Think it will blow up? 👇
${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}`;
}

/* ==========================================================================
   Formatting Utilities
   ========================================================================== */

/**
 * Formats currency values for billing and pricing displays.
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats dates consistently across the dashboard.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
}

/**
 * Formats relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Truncates text with ellipsis for UI cards and previews.
 */
export function truncate(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/* ==========================================================================
   Validation & Scoring Utilities
   ========================================================================== */

/**
 * Validates if a score is within valid range (0-100).
 */
export function isValidScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

/**
 * Returns a color class based on viral score for UI feedback.
 */
export function getScoreColorClass(score: number): string {
  if (score >= 85) return "text-green-400";
  if (score >= 60) return "text-cyan-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

/**
 * Returns a label based on viral score (High/Medium/Low).
 */
export function getScoreLabel(score: number): string {
  if (score >= 85) return "High Viral Potential";
  if (score >= 60) return "Moderate Potential";
  if (score >= 40) return "Needs Improvement";
  return "Low Engagement Risk";
}

/* ==========================================================================
   Tier & Billing Utilities
   ========================================================================== */

/**
 * Formats tier name for display (e.g., "Creator" instead of "creator").
 */
export function formatTierName(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

/**
 * Returns tier-specific limit description.
 */
export function getTierLimitDescription(tier: 'free' | 'creator' | 'pro'): string {
  const limits = {
    free: "5 simulations per day",
    creator: "50 simulations per day",
    pro: "500 simulations per day + priority processing",
  };
  return limits[tier] || "Unknown tier";
}

export default {
  cn,
  generateShareText,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  truncate,
  isValidScore,
  getScoreColorClass,
  getScoreLabel,
  formatTierName,
  getTierLimitDescription,
};
