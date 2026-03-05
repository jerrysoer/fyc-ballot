"use client";

import { getChaosLabel } from "@/data/copy";

interface ChaosMeterProps {
  score: number;
  compact?: boolean;
}

export default function ChaosMeter({ score, compact }: ChaosMeterProps) {
  const label = getChaosLabel(score);
  const clampedScore = Math.max(0, Math.min(100, score));

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="chaos-gradient h-2 flex-1 rounded-full relative overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full border-2 border-white shadow-md transition-all duration-500"
            style={{ left: `calc(${clampedScore}% - 6px)` }}
          />
        </div>
        <span className="text-xs font-mono text-muted w-8 text-right">{clampedScore}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-safe-blue">
          Safe
        </span>
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-xs font-mono uppercase tracking-wider text-chaos-red">
          Chaos
        </span>
      </div>
      <div className="chaos-gradient h-3 rounded-full relative overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full border-2 border-white shadow-md transition-all duration-500 ease-out"
          style={{ left: `calc(${clampedScore}% - 8px)` }}
        />
      </div>
      <div className="text-center mt-1">
        <span className="text-lg font-mono font-bold text-ink">{clampedScore}</span>
        <span className="text-sm font-mono text-muted">/100</span>
      </div>
    </div>
  );
}
