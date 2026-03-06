"use client";

import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Archetype } from "@/types";
import { archetypeReveals, getChaosLabel } from "@/data/copy";
import { categories, TOTAL_CATEGORIES, SINNERS_TOTAL } from "@/data/nominees";
import { winners } from "@/data/winners";
import { trackEvent } from "@/lib/analytics";
import { Download, Share2 } from "lucide-react";

interface ShareCardProps {
  archetype: Archetype;
  picks: Record<string, string>;
  chaosScore: number;
  finalScore?: number;
  marketAlignment?: number; // 0–100 percentage
  sinnersPickCount?: number;
}

export default function ShareCard({
  archetype,
  picks,
  chaosScore,
  finalScore,
  marketAlignment,
  sinnersPickCount,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasCeremonyResults = Object.keys(winners).length > 0;

  // Get top 6 picks for display
  const topPicks = categories
    .filter((c) => picks[c.id])
    .slice(0, 6)
    .map((c) => {
      const nominee = c.nominees.find((n) => n.id === picks[c.id]);
      return { category: c.name, pick: nominee?.name ?? "" };
    });

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
        backgroundColor: "#F7F0E3",
        width: 540,
        height: 540,
      });
      const link = document.createElement("a");
      link.download = `oscars-ballot-${archetype}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      trackEvent("card-downloaded");
    } catch {
      // Silent fail
    }
  }, [archetype]);

  const handleShare = useCallback(async () => {
    const text = hasCeremonyResults
      ? `My 98th Oscars ballot: ${finalScore ?? 0}/${TOTAL_CATEGORIES} correct. Chaos score: ${chaosScore}/100 (${chaosLabel}). I'm a ${info.title}.`
      : `My 98th Oscars ballot is locked. Chaos score: ${chaosScore}/100 (${chaosLabel}). I'm a ${info.title}.`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        trackEvent("card-shared");
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      trackEvent("card-shared");
    }
  }, [chaosScore, chaosLabel, info.title, hasCeremonyResults, finalScore]);

  const handleShareToX = useCallback(() => {
    const text = hasCeremonyResults
      ? `My 98th Oscars ballot: ${finalScore ?? 0}/${TOTAL_CATEGORIES} correct. Chaos score: ${chaosScore}/100. I'm a ${info.title}. \ud83c\udfac`
      : `My Oscars ballot is locked. Chaos score: ${chaosScore}/100. I'm a ${info.title}. Think you can beat me? \ud83c\udfac`;
    const url = "https://jerrysoer.github.io/fyc-ballot";
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
    trackEvent("card-shared", { platform: "twitter" });
  }, [chaosScore, info.title, hasCeremonyResults, finalScore]);

  return (
    <div>
      {/* The actual card rendered for html2canvas */}
      <div
        ref={cardRef}
        className="w-[540px] h-[540px] p-8 relative overflow-hidden mx-auto"
        style={{
          fontFamily: "'Playfair Display', serif",
          background: chaosScore > 70
            ? "linear-gradient(135deg, #F7F0E3 0%, #FDE8E0 50%, #F7F0E3 100%)"
            : chaosScore > 40
            ? "linear-gradient(135deg, #F7F0E3 0%, #FFF3E0 50%, #F7F0E3 100%)"
            : "#F7F0E3",
        }}
      >
        {/* Film-strip perforated border */}
        <div className="absolute inset-0">
          {/* Top perforations */}
          <div className="absolute top-1 left-0 right-0 flex justify-between px-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`t${i}`} className="w-3 h-2 rounded-sm bg-gold/15" />
            ))}
          </div>
          {/* Bottom perforations */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`b${i}`} className="w-3 h-2 rounded-sm bg-gold/15" />
            ))}
          </div>
        </div>
        {/* Gold border */}
        <div className="absolute inset-3 border-2 border-gold/40 rounded-sm" />
        <div className="absolute inset-4 border border-gold/20 rounded-sm" />

        {/* Header */}
        <div className="relative text-center pt-4 pb-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-1"
             style={{ fontFamily: "'DM Sans', sans-serif" }}>
            For Your Consideration
          </p>
          <h2 className="text-2xl font-bold text-ink">98th Academy Awards</h2>
          <p className="text-sm italic text-gold mt-1">{info.title}</p>
        </div>

        {/* Archetype stamp */}
        <div className="absolute top-12 right-8 animate-stamp-in">
          <div className="border-2 border-chaos-red/60 rounded px-3 py-1 rotate-[-12deg]">
            <span className="text-[10px] uppercase tracking-wider text-chaos-red font-bold"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
              {chaosLabel}
            </span>
          </div>
        </div>

        {/* Chaos score */}
        <div className="relative text-center mb-4">
          <span className="text-3xl font-bold text-ink"
                style={{ fontFamily: "'DM Mono', monospace" }}>
            {chaosScore}
          </span>
          <span className="text-sm text-muted">/100 chaos</span>
        </div>

        {/* Top picks */}
        <div className="relative space-y-1.5 mb-4">
          {topPicks.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-muted w-[140px] truncate text-right text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {p.category}
              </span>
              <span className="text-gold text-xs">—</span>
              <span className="text-ink font-semibold truncate text-xs">{p.pick}</span>
            </div>
          ))}
        </div>

        {/* Market alignment + Sinners loyalty */}
        <div className="relative flex items-center justify-center gap-4 mb-2">
          {marketAlignment !== undefined && (
            <div className="text-center">
              <span className="text-lg font-bold text-ink"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                {marketAlignment}%
              </span>
              <p className="text-[9px] text-muted"
                 style={{ fontFamily: "'DM Sans', sans-serif" }}>
                market alignment
              </p>
            </div>
          )}
          {sinnersPickCount !== undefined && sinnersPickCount > 0 && (
            <div className="text-center">
              <span className="text-lg font-bold text-chaos-red"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                {sinnersPickCount}/{SINNERS_TOTAL}
              </span>
              <p className="text-[9px] text-muted"
                 style={{ fontFamily: "'DM Sans', sans-serif" }}>
                sinners loyalty
              </p>
            </div>
          )}
        </div>

        {/* Post-ceremony score */}
        {hasCeremonyResults && finalScore !== undefined && (
          <div className="relative text-center mt-4 pt-3 border-t border-gold/20">
            <span className="text-2xl font-bold text-gold"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
              {finalScore}/{TOTAL_CATEGORIES}
            </span>
            <p className="text-xs text-muted mt-1"
               style={{ fontFamily: "'DM Sans', sans-serif" }}>
              correct predictions
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-5 left-0 right-0 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted/60"
             style={{ fontFamily: "'DM Sans', sans-serif" }}>
            for-your-consideration.vercel.app
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center mt-6 flex-wrap">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 bg-gold text-white font-semibold rounded-lg
                     hover:bg-gold/90 transition-colors min-h-[48px]"
        >
          <Download size={18} />
          Download PNG
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 border border-gold text-gold font-semibold rounded-lg
                     hover:bg-gold-dim transition-colors min-h-[48px]"
        >
          <Share2 size={18} />
          Share
        </button>
        <button
          onClick={handleShareToX}
          className="flex items-center gap-2 px-5 py-3 border border-gold text-gold font-semibold rounded-lg
                     hover:bg-gold-dim transition-colors min-h-[48px]"
        >
          <span className="text-lg leading-none">{"\ud835\udd4f"}</span>
          Share to {"\ud835\udd4f"}
        </button>
      </div>
    </div>
  );
}
