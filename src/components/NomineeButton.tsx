"use client";

import { Play } from "lucide-react";
import { Nominee } from "@/types";
import { getTrailerUrl } from "@/data/trailers";

interface NomineeButtonProps {
  nominee: Nominee;
  isSelected: boolean;
  onSelect: (nomineeId: string) => void;
  odds?: number; // 0–1 probability from Polymarket
  polymarketSlug?: string;
}

function formatOdds(odds: number): string {
  return `${Math.round(odds * 100)}%`;
}

function getOddsColor(odds: number): string {
  if (odds >= 0.5) return "text-emerald-700 bg-emerald-50";
  if (odds >= 0.1) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
}

export default function NomineeButton({
  nominee,
  isSelected,
  onSelect,
  odds,
  polymarketSlug,
}: NomineeButtonProps) {
  return (
    <button
      onClick={() => onSelect(nominee.id)}
      className={`relative w-full text-left p-4 rounded-xl border transition-all min-h-[48px]
                  active:scale-[0.98] ${
                    isSelected
                      ? "border-gold bg-gold/15 shadow-[0_0_0_1px_var(--gold)]"
                      : "border-border bg-card-bg hover:border-gold/50 hover:bg-gold-dim"
                  }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-semibold truncate ${isSelected ? "text-gold" : "text-ink"}`}>
            {nominee.name}
          </p>
          <a
            href={getTrailerUrl(nominee.film)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-muted truncate inline-flex items-center gap-1
                       hover:text-gold transition-colors group/trailer"
            title={`Watch ${nominee.film} trailer`}
          >
            <Play size={10} className="shrink-0 opacity-40 group-hover/trailer:opacity-100" />
            {nominee.film}
          </a>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {odds !== undefined && polymarketSlug ? (
            <a
              href={`https://polymarket.com/event/${polymarketSlug}?ref=fyc`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity ${getOddsColor(odds)}`}
              title="Polymarket odds — click to view market"
            >
              {formatOdds(odds)}
            </a>
          ) : odds !== undefined ? (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${getOddsColor(odds)}`}
              title="Polymarket odds"
            >
              {formatOdds(odds)}
            </span>
          ) : null}
          {nominee.isFrontrunner && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-safe-blue bg-safe-blue/10 px-2 py-0.5 rounded-full">
              safe pick
            </span>
          )}
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
