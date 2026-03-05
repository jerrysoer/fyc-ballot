"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SessionData } from "@/types";
import { getSession } from "@/lib/session";
import { archetypeReveals, getChaosTaunt } from "@/data/copy";
import { computeChaosScore } from "@/lib/chaos";
import ShareCard from "@/components/ShareCard";
import ChaosMeter from "@/components/ChaosMeter";
import SinnersTracker from "@/components/SinnersTracker";
import Leaderboard from "@/components/Leaderboard";
import { getSinnersPickCount } from "@/lib/chaos";
import { TOTAL_CATEGORIES, categories } from "@/data/nominees";
import { useOdds, computeMarketAlignment, getOddsForNominee } from "@/hooks/useOdds";
import { Trophy, Skull, TrendingUp, Check, X, Minus, Radio } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [totalBallots, setTotalBallots] = useState<number | null>(null);
  const [liveWinners, setLiveWinners] = useState<Record<string, string>>({});
  const { odds } = useOdds();

  const fetchWinners = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/winners"));
      if (res.ok) {
        const data = await res.json();
        setLiveWinners(data.winners ?? {});
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const s = getSession();
    if (!s?.submitted || !s.archetype) {
      router.push("/");
      return;
    }
    setSession(s);

    // Fetch lightweight stats
    fetch(apiUrl("/api/stats"))
      .then((r) => r.json())
      .then((data) => {
        if (data.totalBallots) setTotalBallots(data.totalBallots);
      })
      .catch(() => {});

    // Fetch live winners
    fetchWinners();

    // Poll every 30 seconds during ceremony
    const interval = setInterval(fetchWinners, 30000);
    return () => clearInterval(interval);
  }, [router, fetchWinners]);

  if (!session || !session.archetype) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-fade-in text-muted">Loading results...</div>
      </main>
    );
  }

  const info = archetypeReveals[session.archetype];
  const chaosScore = session.picks && Object.keys(session.picks).length > 0
    ? computeChaosScore(session.picks)
    : 50;

  const chaosTaunt = getChaosTaunt(chaosScore);
  const announcedCount = Object.keys(liveWinners).length;
  const hasCeremonyResults = announcedCount > 0;
  const isLive = hasCeremonyResults && announcedCount < TOTAL_CATEGORIES;
  const sinnersPickCount = session.picks ? getSinnersPickCount(session.picks) : 0;

  // Calculate live score
  let finalScore = 0;
  if (hasCeremonyResults) {
    for (const [catId, winnerId] of Object.entries(liveWinners)) {
      if (session.picks[catId] === winnerId) {
        finalScore++;
      }
    }
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Live indicator */}
        {isLive && (
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
            <Radio size={14} className="text-chaos-red animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-chaos-red font-bold">
              Live — {announcedCount}/{TOTAL_CATEGORIES} announced
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">
            Your Ballot Is Locked
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-3">
            {info.title}
          </h1>
          <p className="font-serif italic text-gold text-lg">
            {info.tagline}
          </p>
        </div>

        {/* Chaos meter */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <ChaosMeter score={chaosScore} />
        </div>

        {/* Taunt */}
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-8 animate-fade-in"
             style={{ animationDelay: "400ms" }}>
          <p className="font-serif italic text-ink text-center leading-relaxed">
            &ldquo;{chaosTaunt}&rdquo;
          </p>
        </div>

        {/* Sinners loyalty tracker */}
        {sinnersPickCount > 0 && (
          <div className="mb-6 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <SinnersTracker sinnersPickCount={sinnersPickCount} />
          </div>
        )}

        {/* Post-ceremony score */}
        {hasCeremonyResults && (
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-xl px-6 py-4">
              <Trophy className="text-gold" size={24} />
              <div>
                <p className="text-3xl font-mono font-bold text-ink">{finalScore}/{announcedCount}</p>
                <p className="text-sm text-muted">correct predictions</p>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={() => router.push("/cemetery")}
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
              >
                <Skull size={14} />
                Visit the cemetery
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {hasCeremonyResults && session.sessionId && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "650ms" }}>
            <Leaderboard sessionId={session.sessionId} />
          </div>
        )}

        {/* Your Picks breakdown */}
        {hasCeremonyResults && (
          <div className="bg-card-bg border border-border rounded-xl p-5 mb-8 animate-fade-in"
               style={{ animationDelay: "700ms" }}>
            <h3 className="font-serif font-bold text-ink mb-4">Your Picks</h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const userPick = session.picks[cat.id];
                const userNominee = cat.nominees.find((n) => n.id === userPick);
                const winnerId = liveWinners[cat.id];
                const winnerNominee = winnerId
                  ? cat.nominees.find((n) => n.id === winnerId)
                  : null;
                const isCorrect = winnerId && userPick === winnerId;
                const isWrong = winnerId && userPick !== winnerId;

                return (
                  <div
                    key={cat.id}
                    className={`flex items-start gap-2 py-2 border-b border-border/50 last:border-0 ${
                      isCorrect ? "animate-fade-in" : ""
                    }`}
                  >
                    {/* Status icon */}
                    <div className="shrink-0 mt-0.5">
                      {isCorrect ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      ) : isWrong ? (
                        <div className="w-5 h-5 rounded-full bg-chaos-red flex items-center justify-center">
                          <X size={12} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center">
                          <Minus size={12} className="text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Category details */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-muted uppercase tracking-wider">
                        {cat.name}
                      </p>
                      <p className={`text-sm font-semibold ${
                        isCorrect ? "text-emerald-600" : isWrong ? "text-ink" : "text-muted"
                      }`}>
                        {userNominee?.name ?? "No pick"}
                      </p>
                      {isWrong && winnerNominee && (
                        <p className="text-xs text-muted mt-0.5">
                          Winner: <span className="text-gold font-semibold">{winnerNominee.name}</span>
                        </p>
                      )}
                      {!winnerId && (
                        <p className="text-xs italic text-muted mt-0.5">Awaiting...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Your Picks vs. The Market */}
        {session.picks && Object.keys(odds).length > 0 && (() => {
          const { alignment, total, matched } = computeMarketAlignment(session.picks, odds);

          // Find boldest pick (lowest odds among user picks)
          let boldestPick: { category: string; nominee: string; odds: number } | null = null;
          for (const cat of categories) {
            const pickId = session.picks[cat.id];
            if (!pickId) continue;
            const prob = getOddsForNominee(odds, cat.id, pickId);
            if (prob !== undefined && (!boldestPick || prob < boldestPick.odds)) {
              const nom = cat.nominees.find((n) => n.id === pickId);
              if (nom) {
                boldestPick = { category: cat.name, nominee: nom.name, odds: prob };
              }
            }
          }

          return (
            <div className="bg-card-bg border border-border rounded-xl p-5 mb-8 animate-fade-in"
                 style={{ animationDelay: "750ms" }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-gold" />
                <h3 className="font-serif font-bold text-ink">Your Picks vs. The Market</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted">
                  You agreed with Polymarket&apos;s favorite in{" "}
                  <span className="font-mono font-bold text-ink">{matched}/{total}</span>{" "}
                  categories ({alignment}% market alignment).
                </p>
                {alignment >= 70 ? (
                  <p className="text-xs italic text-muted">
                    You&apos;re a market follower. Safe money likes safe money.
                  </p>
                ) : alignment <= 30 ? (
                  <p className="text-xs italic text-chaos-red">
                    Market rebel. The bettors would hate your ballot.
                  </p>
                ) : (
                  <p className="text-xs italic text-muted">
                    A healthy mix of conviction and consensus.
                  </p>
                )}
                {boldestPick && boldestPick.odds < 0.15 && (
                  <p className="text-xs text-chaos-red font-mono mt-2">
                    Boldest pick: {boldestPick.nominee} ({boldestPick.category}) at {Math.round(boldestPick.odds * 100)}% odds
                  </p>
                )}
              </div>
            </div>
          );
        })()}

        {/* Stats */}
        {totalBallots && (
          <p className="text-center text-sm text-muted mb-8 font-mono">
            {totalBallots.toLocaleString()} ballots submitted
          </p>
        )}

        {/* Share card */}
        <div className="animate-fade-in" style={{ animationDelay: "800ms" }}>
          <ShareCard
            archetype={session.archetype}
            picks={session.picks}
            chaosScore={chaosScore}
            finalScore={hasCeremonyResults ? finalScore : undefined}
            marketAlignment={Object.keys(odds).length > 0
              ? computeMarketAlignment(session.picks, odds).alignment
              : undefined}
            sinnersPickCount={sinnersPickCount}
          />
        </div>
      </div>
    </main>
  );
}
