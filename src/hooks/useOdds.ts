"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";

/**
 * Odds shape: { [categoryId]: { [nomineeId]: probability } }
 * probability is 0–1 (e.g., 0.79 = 79%).
 */
type OddsMap = Record<string, Record<string, number>>;

interface UseOddsResult {
  odds: OddsMap;
  loading: boolean;
  error: boolean;
}

/**
 * Client-side hook that fetches Polymarket odds from /api/odds once on mount.
 * SWR-style: fetch once, no refetch. Odds don't change fast enough during
 * a single ballot session to warrant polling.
 */
export function useOdds(): UseOddsResult {
  const [odds, setOdds] = useState<OddsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchOdds() {
      try {
        const res = await fetch(apiUrl("/api/odds"));
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: OddsMap = await res.json();
        if (!cancelled) {
          setOdds(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchOdds();
    return () => { cancelled = true; };
  }, []);

  return { odds, loading, error };
}

/**
 * Get the probability for a specific nominee in a category.
 * Returns undefined if no odds available.
 */
export function getOddsForNominee(
  odds: OddsMap,
  categoryId: string,
  nomineeId: string,
): number | undefined {
  return odds[categoryId]?.[nomineeId];
}

/**
 * Get the highest-odds nominee in a category (the market favorite).
 * Returns the nomineeId or undefined if no odds available.
 */
export function getMarketFavorite(
  odds: OddsMap,
  categoryId: string,
): string | undefined {
  const catOdds = odds[categoryId];
  if (!catOdds) return undefined;

  let bestId: string | undefined;
  let bestOdds = -1;

  for (const [id, prob] of Object.entries(catOdds)) {
    if (prob > bestOdds) {
      bestOdds = prob;
      bestId = id;
    }
  }

  return bestId;
}

/**
 * Compute market alignment score: what percentage of the user's picks
 * match the highest-odds nominee in each category.
 */
export function computeMarketAlignment(
  picks: Record<string, string>,
  odds: OddsMap,
): { alignment: number; total: number; matched: number } {
  let total = 0;
  let matched = 0;

  for (const [categoryId, nomineeId] of Object.entries(picks)) {
    const favorite = getMarketFavorite(odds, categoryId);
    if (!favorite) continue;
    total++;
    if (nomineeId === favorite) matched++;
  }

  return {
    alignment: total > 0 ? Math.round((matched / total) * 100) : 50,
    total,
    matched,
  };
}
