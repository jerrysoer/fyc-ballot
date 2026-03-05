"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionData } from "@/types";
import { getSession } from "@/lib/session";
import { winners } from "@/data/winners";
import { categories } from "@/data/nominees";
import { trackEvent } from "@/lib/analytics";
import Tombstone from "@/components/Tombstone";
import { Trophy, ArrowLeft } from "lucide-react";

export default function CemeteryPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

  const ceremonyComplete = process.env.NEXT_PUBLIC_CEREMONY_COMPLETE === "true";
  const hasWinners = Object.keys(winners).length > 0;

  useEffect(() => {
    if (!ceremonyComplete || !hasWinners) return;

    const s = getSession();
    if (!s?.submitted) {
      router.push("/");
      return;
    }
    setSession(s);
    trackEvent("cemetery-visited");
  }, [router, ceremonyComplete, hasWinners]);

  if (!ceremonyComplete || !hasWinners) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">🪦</p>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">
            The Cemetery Is Closed
          </h1>
          <p className="text-muted mb-6">
            Come back after the ceremony on March 15 to see which of your picks survived
            — and which ones didn&apos;t.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-5 py-3 border border-border text-muted
                       hover:text-ink hover:border-border-dark transition-colors rounded-lg min-h-[44px]"
          >
            <ArrowLeft size={16} />
            Back to Ballot
          </button>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="cemetery min-h-screen flex items-center justify-center">
        <div className="animate-fade-in text-cemetery-muted">Loading...</div>
      </main>
    );
  }

  // Separate correct and incorrect picks
  const correct: { category: string; pick: string }[] = [];
  const incorrect: { categoryName: string; pickName: string; winnerName: string }[] = [];

  for (const cat of categories) {
    const pick = session.picks[cat.id];
    const winner = winners[cat.id];
    if (!pick || !winner) continue;

    const pickNominee = cat.nominees.find((n) => n.id === pick);
    const winnerNominee = cat.nominees.find((n) => n.id === winner);

    if (pick === winner) {
      correct.push({
        category: cat.name,
        pick: pickNominee?.name ?? pick,
      });
    } else {
      incorrect.push({
        categoryName: cat.name,
        pickName: pickNominee?.name ?? pick,
        winnerName: winnerNominee?.name ?? winner,
      });
    }
  }

  const totalScored = correct.length + incorrect.length;

  return (
    <main className="cemetery min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-sm font-mono text-cemetery-muted uppercase tracking-[0.3em] mb-4">
            The 98th Academy Awards
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cemetery-text mb-3">
            The Cemetery
          </h1>
          <p className="text-cemetery-muted text-lg">
            Your final score:{" "}
            <span className="font-mono font-bold text-gold">
              {correct.length}/{totalScored}
            </span>
          </p>
        </div>

        {/* Correct picks */}
        {correct.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-mono uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
              <Trophy size={14} />
              Correct Predictions ({correct.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {correct.map((c, i) => (
                <div
                  key={i}
                  className="bg-gold/10 border border-gold/20 rounded-xl p-4 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="text-xs font-mono text-gold/60 uppercase tracking-wider mb-1">
                    {c.category}
                  </p>
                  <p className="font-semibold text-gold">{c.pick}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombstones */}
        {incorrect.length > 0 && (
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest text-cemetery-muted mb-4">
              Rest in Peace ({incorrect.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {incorrect.map((item, i) => (
                <Tombstone
                  key={i}
                  categoryName={item.categoryName}
                  nomineeName={item.pickName}
                  winnerName={item.winnerName}
                  delay={i * 150}
                />
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/results")}
            className="inline-flex items-center gap-2 text-sm text-cemetery-muted hover:text-cemetery-text transition-colors"
          >
            <ArrowLeft size={14} />
            Back to results
          </button>
        </div>
      </div>
    </main>
  );
}
