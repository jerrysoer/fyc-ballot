"use client";

import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Archetype } from "@/types";
import { archetypeReveals, getChaosLabel } from "@/data/copy";
import { categories, TOTAL_CATEGORIES } from "@/data/nominees";
import { trackEvent } from "@/lib/analytics";
import { Download } from "lucide-react";

interface ReceiptCardProps {
  archetype: Archetype;
  picks: Record<string, string>;
  chaosScore: number;
  winners: Record<string, string>;
  odds?: Record<string, Record<string, number>>;
}

export default function ReceiptCard({
  archetype,
  picks,
  chaosScore,
  winners,
  odds,
}: ReceiptCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const announcedCount = Object.keys(winners).length;
  if (announcedCount < TOTAL_CATEGORIES) return null; // Only show when all winners announced

  // Compute score
  let correctCount = 0;
  const correct: string[] = [];
  const wrong: { category: string; userPick: string; winner: string }[] = [];

  for (const cat of categories) {
    const userPickId = picks[cat.id];
    const winnerId = winners[cat.id];
    if (!winnerId) continue;

    const userNominee = cat.nominees.find((n) => n.id === userPickId);
    const winnerNominee = cat.nominees.find((n) => n.id === winnerId);

    if (userPickId === winnerId) {
      correctCount++;
      correct.push(cat.name);
    } else {
      wrong.push({
        category: cat.name,
        userPick: userNominee?.name ?? "No pick",
        winner: winnerNominee?.name ?? "Unknown",
      });
    }
  }

  // Find boldest pick (lowest odds)
  let boldestPick: { category: string; nominee: string; odds: number } | null = null;
  if (odds) {
    for (const cat of categories) {
      const pickId = picks[cat.id];
      if (!pickId) continue;
      const catOdds = odds[cat.id];
      if (!catOdds) continue;
      const prob = catOdds[pickId];
      if (prob !== undefined && (!boldestPick || prob < boldestPick.odds)) {
        const nom = cat.nominees.find((n) => n.id === pickId);
        if (nom) {
          boldestPick = { category: cat.name, nominee: nom.name, odds: prob };
        }
      }
    }
  }

  const info = archetypeReveals[archetype];
  const chaosLabel = getChaosLabel(chaosScore);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: false,
        allowTaint: false,
        foreignObjectRendering: false,
        backgroundColor: "#FAFAF5",
      });
      const link = document.createElement("a");
      link.download = `oscars-receipt-${archetype}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      trackEvent("card-downloaded", { type: "receipt" });
    } catch {
      // Silent fail
    }
  }, [archetype]);

  const handleShareToX = useCallback(() => {
    const text = `My 98th Oscars receipt: ${correctCount}/${TOTAL_CATEGORIES} correct. Chaos: ${chaosScore}/100. I'm a ${info.title}. ${
      boldestPick
        ? `Boldest call: ${boldestPick.nominee} at ${Math.round(boldestPick.odds * 100)}% odds.`
        : ""
    } \ud83c\udfac`;
    const url = "https://jerrysoer.github.io/fyc-ballot";
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
    trackEvent("card-shared", { platform: "twitter", type: "receipt" });
  }, [chaosScore, info.title, correctCount, boldestPick]);

  return (
    <div>
      {/* Receipt rendered for html2canvas */}
      <div
        ref={cardRef}
        className="max-w-sm mx-auto p-6"
        style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          backgroundColor: "#FAFAF5",
          color: "#1a1a1a",
        }}
      >
        {/* Top border */}
        <div className="text-center text-xs tracking-[0.15em] mb-1" style={{ color: "#999" }}>
          {"═".repeat(35)}
        </div>

        {/* Header */}
        <div className="text-center mb-1">
          <p className="text-xs font-bold tracking-widest uppercase">98TH OSCARS RECEIPT</p>
          <p className="text-[10px]" style={{ color: "#666" }}>March 15, 2026</p>
        </div>

        <div className="text-center text-xs tracking-[0.15em] mb-3" style={{ color: "#999" }}>
          {"═".repeat(35)}
        </div>

        {/* Correct picks */}
        {correct.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Correct</p>
            {correct.map((name) => (
              <p key={name} className="text-xs pl-2">
                ✓ {name}
              </p>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="text-xs tracking-[0.15em] mb-3" style={{ color: "#ccc" }}>
          {"─".repeat(35)}
        </div>

        {/* Wrong picks */}
        {wrong.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1">Wrong</p>
            {wrong.map((w) => (
              <div key={w.category} className="pl-2 mb-1.5">
                <p className="text-xs">✗ {w.category}</p>
                <p className="text-[10px] pl-3" style={{ color: "#666" }}>
                  → You: {w.userPick}
                </p>
                <p className="text-[10px] pl-3" style={{ color: "#666" }}>
                  → Winner: {w.winner}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="text-xs tracking-[0.15em] mb-3" style={{ color: "#ccc" }}>
          {"─".repeat(35)}
        </div>

        {/* Stats */}
        <div className="space-y-1 mb-3">
          <p className="text-xs">
            SCORE: <span className="font-bold">{correctCount}/{TOTAL_CATEGORIES}</span>
          </p>
          <p className="text-xs">
            CHAOS: <span className="font-bold">{chaosScore}/100</span>
          </p>
          <p className="text-xs">
            TYPE: <span className="font-bold">{chaosLabel}</span>
          </p>
        </div>

        {/* Divider */}
        <div className="text-xs tracking-[0.15em] mb-3" style={{ color: "#ccc" }}>
          {"─".repeat(35)}
        </div>

        {/* Personalized roast */}
        {boldestPick && (
          <p className="text-[10px] italic mb-3" style={{ color: "#555" }}>
            &ldquo;Your boldest call: {boldestPick.nominee} ({boldestPick.category}) at{" "}
            {Math.round(boldestPick.odds * 100)}% odds.&rdquo;
          </p>
        )}

        {/* Archetype */}
        <div className="text-center mb-2">
          <p className="text-xs italic" style={{ color: "#888" }}>
            {info.title}
          </p>
        </div>

        {/* Bottom border */}
        <div className="text-center text-xs tracking-[0.15em]" style={{ color: "#999" }}>
          {"═".repeat(35)}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center mt-4 flex-wrap">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 bg-ink text-white font-semibold rounded-lg
                     hover:bg-ink/90 transition-colors min-h-[48px] text-sm"
        >
          <Download size={16} />
          Download Receipt
        </button>
        <button
          onClick={handleShareToX}
          className="flex items-center gap-2 px-5 py-3 border border-ink text-ink font-semibold rounded-lg
                     hover:bg-ink/5 transition-colors min-h-[48px] text-sm"
        >
          <span className="text-base leading-none">{"\ud835\udd4f"}</span>
          Share Receipt
        </button>
      </div>
    </div>
  );
}
