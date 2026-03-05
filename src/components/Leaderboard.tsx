"use client";

import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { apiUrl } from "@/lib/api";

interface LeaderboardData {
  userScore: number;
  announcedCategories: number;
  percentile: number;
  totalBallots: number;
  scoreDistribution: Record<number, number>;
}

export default function Leaderboard({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboard() {
      try {
        const res = await fetch(apiUrl(`/api/leaderboard?sessionId=${sessionId}`));
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        // Silently fail
      }
    }

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  if (!data || data.announcedCategories === 0 || data.totalBallots === 0) return null;

  const maxCount = Math.max(...Object.values(data.scoreDistribution), 1);

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Crown size={16} className="text-gold" />
        <h3 className="font-serif font-bold text-ink">Leaderboard</h3>
      </div>

      {/* Score headline */}
      <div className="text-center mb-4">
        <p className="text-3xl font-mono font-bold text-ink">
          {data.userScore}/{data.announcedCategories}
        </p>
        <p className="text-sm text-muted mt-1">
          Better than{" "}
          <span className="font-mono font-semibold text-gold">{data.percentile}%</span>
          {" "}of {data.totalBallots.toLocaleString()} player{data.totalBallots !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Score distribution histogram */}
      <div className="flex items-end gap-0.5 h-16 mt-4">
        {Array.from({ length: data.announcedCategories + 1 }, (_, i) => {
          const count = data.scoreDistribution[i] ?? 0;
          const height = count > 0 ? Math.max((count / maxCount) * 100, 8) : 4;
          const isUser = i === data.userScore;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t transition-all ${
                  isUser ? "bg-gold" : "bg-border"
                }`}
                style={{ height: `${height}%` }}
                title={`${i} correct: ${count} ballot${count !== 1 ? "s" : ""}`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-mono text-muted">0</span>
        <span className="text-[9px] font-mono text-muted">{data.announcedCategories}</span>
      </div>
    </div>
  );
}
