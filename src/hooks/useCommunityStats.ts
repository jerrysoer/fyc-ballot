"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

export type CommunityStats = Record<string, Record<string, number>>;

export function getPickPercentage(
  stats: CommunityStats | null,
  categoryId: string,
  nomineeId: string
): number | undefined {
  if (!stats) return undefined;
  return stats[categoryId]?.[nomineeId];
}

export function useCommunityStats() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch(apiUrl("/api/community-stats"));
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        // Silently fail — community stats are non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading };
}
