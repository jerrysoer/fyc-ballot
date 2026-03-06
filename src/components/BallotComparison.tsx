"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/nominees";
import { archetypeReveals } from "@/data/copy";
import { Archetype } from "@/types";
import { apiUrl } from "@/lib/api";
import { Check, X, Minus } from "lucide-react";

interface FriendBallot {
  archetype: Archetype;
  picks: Record<string, string>;
  chaosScore: number;
}

interface BallotComparisonProps {
  userPicks: Record<string, string>;
  userArchetype: Archetype;
  friendSessionId: string;
  winners?: Record<string, string>;
}

export default function BallotComparison({
  userPicks,
  userArchetype,
  friendSessionId,
  winners = {},
}: BallotComparisonProps) {
  const [friend, setFriend] = useState<FriendBallot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFriend() {
      try {
        const res = await fetch(apiUrl(`/api/ballot/${friendSessionId}`));
        if (!res.ok) {
          setError("Ballot not found");
          return;
        }
        const data = await res.json();
        setFriend(data);
      } catch {
        setError("Failed to load ballot");
      } finally {
        setLoading(false);
      }
    }
    fetchFriend();
  }, [friendSessionId]);

  if (loading) {
    return (
      <div className="bg-card-bg border border-border rounded-xl p-5 mb-8 animate-fade-in">
        <p className="text-sm text-muted text-center">Loading friend&apos;s ballot...</p>
      </div>
    );
  }

  if (error || !friend) {
    return (
      <div className="bg-card-bg border border-border rounded-xl p-5 mb-8 animate-fade-in">
        <p className="text-sm text-muted text-center">{error ?? "Could not load ballot."}</p>
      </div>
    );
  }

  const friendInfo = archetypeReveals[friend.archetype];
  const userInfo = archetypeReveals[userArchetype];
  const hasCeremony = Object.keys(winners).length > 0;

  // Count agreements
  let agreements = 0;
  for (const cat of categories) {
    if (userPicks[cat.id] && userPicks[cat.id] === friend.picks[cat.id]) {
      agreements++;
    }
  }

  return (
    <div className="bg-card-bg border border-border rounded-xl p-5 mb-8 animate-fade-in">
      <h3 className="font-serif font-bold text-ink mb-1 text-center">You vs. Your Friend</h3>
      <p className="text-xs text-muted text-center mb-4">
        {userInfo.title} vs. {friendInfo.title} — {agreements}/{categories.length} picks match
      </p>

      <div className="space-y-2">
        {categories.map((cat) => {
          const userPick = userPicks[cat.id];
          const friendPick = friend.picks[cat.id];
          const userNominee = cat.nominees.find((n) => n.id === userPick);
          const friendNominee = cat.nominees.find((n) => n.id === friendPick);
          const agree = userPick && userPick === friendPick;
          const winnerId = winners[cat.id];

          return (
            <div
              key={cat.id}
              className={`py-2 border-b border-border/50 last:border-0 ${
                agree ? "bg-emerald-50/50" : ""
              }`}
            >
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
                {cat.name}
              </p>
              <div className="flex items-center gap-2 text-sm">
                {/* User pick */}
                <div className="flex-1 min-w-0">
                  <span className={`font-semibold truncate block ${
                    hasCeremony && winnerId === userPick ? "text-emerald-600" : "text-ink"
                  }`}>
                    {userNominee?.name ?? "—"}
                  </span>
                </div>

                {/* Agreement indicator */}
                <div className="shrink-0">
                  {agree ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  ) : userPick && friendPick ? (
                    <div className="w-5 h-5 rounded-full bg-chaos-red/20 flex items-center justify-center">
                      <X size={12} className="text-chaos-red" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center">
                      <Minus size={12} className="text-muted" />
                    </div>
                  )}
                </div>

                {/* Friend pick */}
                <div className="flex-1 min-w-0 text-right">
                  <span className={`font-semibold truncate block ${
                    hasCeremony && winnerId === friendPick ? "text-emerald-600" : "text-muted"
                  }`}>
                    {friendNominee?.name ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
