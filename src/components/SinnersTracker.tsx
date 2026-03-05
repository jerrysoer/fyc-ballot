"use client";

import { getSinnersLoyaltyTier } from "@/data/copy";
import { SINNERS_TOTAL } from "@/data/nominees";

interface SinnersTrackerProps {
  sinnersPickCount: number;
}

export default function SinnersTracker({ sinnersPickCount }: SinnersTrackerProps) {
  if (sinnersPickCount === 0) return null;

  const tier = getSinnersLoyaltyTier(sinnersPickCount);
  const loyaltyPercent = Math.round((sinnersPickCount / SINNERS_TOTAL) * 100);

  return (
    <div className="animate-fade-in bg-chaos-red/8 border border-chaos-red/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-chaos-red">
          Sinners Loyalty
        </span>
        <span className="text-xs font-mono text-muted">
          {sinnersPickCount}/{SINNERS_TOTAL}
        </span>
      </div>

      {/* Loyalty meter */}
      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${loyaltyPercent}%`,
            background: loyaltyPercent > 75
              ? "linear-gradient(90deg, var(--chaos-red), #E85D3A)"
              : loyaltyPercent > 50
              ? "linear-gradient(90deg, #B86432, var(--chaos-red))"
              : "linear-gradient(90deg, var(--gold), #B86432)",
          }}
        />
      </div>

      <p className="text-sm font-semibold text-ink mb-0.5">{tier.title}</p>
      <p className="text-xs text-muted italic">{tier.message}</p>
    </div>
  );
}
