"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/nominees";
import { getSession, saveSession } from "@/lib/session";
import { useBallot } from "@/hooks/useBallot";
import { trackEvent } from "@/lib/analytics";
import { apiUrl } from "@/lib/api";
import CategoryCard from "@/components/CategoryCard";
import ChaosMeter from "@/components/ChaosMeter";
import SinnersTracker from "@/components/SinnersTracker";
import { useOdds, getOddsForNominee, getMarketFavorite } from "@/hooks/useOdds";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import { getMidBallotRoast } from "@/lib/roasts";
import { ChevronLeft, ChevronRight, Lock, RotateCcw } from "lucide-react";

export default function BallotPage() {
  const router = useRouter();
  const {
    state,
    currentCategory,
    pickCount,
    isComplete,
    sinnersPickCount,
    init,
    pick,
    next,
    prev,
    goTo,
    reset,
    submit,
  } = useBallot();
  const { odds } = useOdds();
  const { stats: communityStats } = useCommunityStats();
  const [isReady, setIsReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [toast, setToast] = useState<string | null>(null);
  const [roast, setRoast] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session?.archetype) {
      router.push("/");
      return;
    }
    init(session.archetype);
    setIsReady(true);
  }, [router, init]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const handleNext = useCallback(() => {
    if (state.currentIndex < categories.length - 1) {
      setAnimDir("out");
      setTimeout(() => {
        next();
        setAnimDir("in");
        // Check for mid-ballot roast at milestone
        const r = getMidBallotRoast(state.picks, state.currentIndex + 1);
        if (r) {
          setRoast(r.message);
          setTimeout(() => setRoast(null), 5000);
        }
      }, 150);
    }
  }, [state.currentIndex, state.picks, next]);

  const handlePrev = useCallback(() => {
    if (state.currentIndex > 0) {
      setAnimDir("out");
      setTimeout(() => {
        prev();
        setAnimDir("in");
      }, 150);
    }
  }, [state.currentIndex, prev]);

  const handlePick = useCallback(
    (categoryId: string, nomineeId: string) => {
      pick(categoryId, nomineeId);

      // Show toast feedback based on Polymarket odds
      const nomineeOdds = getOddsForNominee(odds, categoryId, nomineeId);
      const favorite = getMarketFavorite(odds, categoryId);
      if (nomineeOdds !== undefined) {
        if (nomineeOdds >= 0.5) {
          setToast("Going with the favorite!");
        } else if (nomineeOdds < 0.05) {
          setToast(`Bold — only ${Math.round(nomineeOdds * 100)}% of bettors agree`);
        } else if (favorite && nomineeId !== favorite) {
          setToast(`Contrarian pick — ${Math.round(nomineeOdds * 100)}% odds`);
        }
        if (nomineeOdds !== undefined) {
          setTimeout(() => setToast(null), 2500);
        }
      }

      // Auto-advance to next category after a brief delay
      if (state.currentIndex < categories.length - 1) {
        setTimeout(() => {
          handleNext();
        }, 700);
      }
    },
    [pick, odds, handleNext, state.currentIndex]
  );

  const handleReset = useCallback(() => {
    if (pickCount === 0) return;
    if (!confirm("Start over? All your picks will be cleared.")) return;
    reset();
    setAnimDir("in");
    setToast(null);
    setRoast(null);
  }, [pickCount, reset]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl("/api/ballot"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          archetype: state.archetype,
          picks: state.picks,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to submit ballot");
        setSubmitting(false);
        return;
      }

      submit();
      // Update session as submitted
      const session = getSession();
      if (session) {
        saveSession({ ...session, submitted: true });
      }
      trackEvent("ballot-completed", { chaosScore: state.chaosScore.toString() });
      router.push("/results");
    } catch {
      alert("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-fade-in text-muted">Loading ballot...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-36 pt-8 px-4">
      {/* Progress dots + reset */}
      <div className="max-w-lg mx-auto mb-6 flex items-center gap-3">
        <div className="flex gap-1 flex-wrap flex-1">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => {
                setAnimDir("in");
                goTo(i);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                state.picks[cat.id]
                  ? "bg-gold"
                  : i === state.currentIndex
                  ? "bg-ink"
                  : "bg-border"
              }`}
              aria-label={`Go to ${cat.name}`}
            />
          ))}
        </div>
        {pickCount > 0 && (
          <button
            onClick={handleReset}
            className="text-muted hover:text-ink transition-colors p-1 shrink-0"
            aria-label="Start over"
            title="Start over"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Category card */}
      <CategoryCard
        category={currentCategory}
        selectedNominee={state.picks[currentCategory.id]}
        onSelect={handlePick}
        progress={`${pickCount}/${categories.length}`}
        animationClass={
          animDir === "in" ? "animate-slide-card-in" : "animate-slide-card-out"
        }
        odds={odds[currentCategory.id]}
        communityStats={communityStats?.[currentCategory.id]}
      />

      {/* Odds toast */}
      {toast && (
        <div className="max-w-lg mx-auto mt-3 animate-fade-in">
          <p className="text-sm text-center text-muted font-mono italic">{toast}</p>
        </div>
      )}

      {/* Mid-ballot roast */}
      {roast && (
        <div className="max-w-lg mx-auto mt-4 animate-fade-in">
          <div className="bg-ink/5 border border-border rounded-xl p-3 text-center">
            <p className="text-sm font-serif italic text-ink">&ldquo;{roast}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Sinners loyalty tracker */}
      {sinnersPickCount > 0 && (
        <div className="max-w-lg mx-auto mt-4">
          <SinnersTracker sinnersPickCount={sinnersPickCount} />
        </div>
      )}

      {/* Bottom bar: nav + chaos meter + submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-parchment/95 backdrop-blur-sm border-t border-border p-4">
        <div className="max-w-lg mx-auto">
          <ChaosMeter score={state.chaosScore} />

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={handlePrev}
              disabled={state.currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2 text-sm text-muted hover:text-ink
                         disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {isComplete ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-white font-semibold rounded-lg
                           hover:bg-gold/90 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                <Lock size={16} />
                {submitting ? "Submitting..." : "Lock Picks"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={state.currentIndex === categories.length - 1}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gold
                           hover:text-gold/80 disabled:opacity-30 disabled:cursor-not-allowed
                           transition-colors min-h-[44px]"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
