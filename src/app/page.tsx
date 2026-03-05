"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Archetype } from "@/types";
import { getSession, saveSession, createSessionId } from "@/lib/session";
import PersonalityQuiz from "@/components/PersonalityQuiz";
import CountdownTimer from "@/components/CountdownTimer";

export default function Home() {
  const router = useRouter();
  const [hasExisting, setHasExisting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.archetype && !session.submitted) {
      setHasExisting(true);
    } else if (session?.submitted) {
      // Already submitted — go to results
      router.push("/results");
    }
  }, [router]);

  function handleQuizComplete(archetype: Archetype) {
    const sessionId = createSessionId();
    saveSession({
      sessionId,
      archetype,
      picks: {},
      currentIndex: 0,
      submitted: false,
    });
    router.push("/ballot");
  }

  function handleResume() {
    router.push("/ballot");
  }

  if (showQuiz) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <PersonalityQuiz onComplete={handleQuizComplete} />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg animate-fade-in-up">
        <p className="text-sm font-mono text-muted uppercase tracking-[0.3em] mb-2">
          The 98th Academy Awards
        </p>
        <div className="mb-4">
          <CountdownTimer />
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-4 leading-tight">
          For Your<br />Consideration
        </h1>
        <p className="text-lg text-muted mb-8 max-w-md mx-auto leading-relaxed">
          Fill out your Oscar ballot. Get roasted along the way.
          See how chaotic your taste really is.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full max-w-xs mx-auto block px-8 py-4 bg-gold text-white font-semibold rounded-lg
                       hover:bg-gold/90 transition-colors min-h-[48px]"
          >
            {hasExisting ? "Start Fresh" : "Begin"}
          </button>

          {hasExisting && (
            <button
              onClick={handleResume}
              className="w-full max-w-xs mx-auto block px-8 py-4 border border-gold text-gold font-semibold rounded-lg
                         hover:bg-gold-dim transition-colors min-h-[48px]"
            >
              Resume Ballot
            </button>
          )}
        </div>

        <p className="text-xs text-muted/60 mt-12 font-mono">
          No account needed. Your picks stay on your device until you submit.
        </p>
      </div>
    </main>
  );
}
