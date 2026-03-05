import { NextResponse } from "next/server";
import { polymarketSlugs } from "@/data/polymarket-slugs";
import { categories } from "@/data/nominees";

const GAMMA_API = "https://gamma-api.polymarket.com/events";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Odds shape: { [categoryId]: { [nomineeName]: probability } }
 * nomineeName is the groupItemTitle from Polymarket (e.g. "Timothée Chalamet").
 */
type OddsMap = Record<string, Record<string, number>>;

let cachedOdds: OddsMap | null = null;
let cacheTimestamp = 0;

/**
 * Build a lookup of nominee names → FYC nominee IDs for fuzzy matching.
 * Polymarket uses film titles for Best Picture but actor/director names for
 * performance categories, so we match against both name and film fields.
 */
function buildNomineeLookup(): Map<string, { categoryId: string; nomineeId: string }> {
  const lookup = new Map<string, { categoryId: string; nomineeId: string }>();
  for (const cat of categories) {
    for (const nom of cat.nominees) {
      // Match on both the nominee display name and the film title
      const nameKey = `${cat.id}:${normalize(nom.name)}`;
      const filmKey = `${cat.id}:${normalize(nom.film)}`;
      lookup.set(nameKey, { categoryId: cat.id, nomineeId: nom.id });
      lookup.set(filmKey, { categoryId: cat.id, nomineeId: nom.id });
    }
  }
  return lookup;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[""'']/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

const nomineeLookup = buildNomineeLookup();

/**
 * Fetches odds for a single category from Polymarket Gamma API.
 * Returns a map of nomineeId → probability (0-1).
 */
async function fetchCategoryOdds(
  categoryId: string,
  slug: string,
): Promise<Record<string, number>> {
  const res = await fetch(`${GAMMA_API}?slug=${slug}`, {
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) return {};

  const events = await res.json();
  if (!Array.isArray(events) || events.length === 0) return {};

  const event = events[0];
  const markets = event.markets;
  if (!Array.isArray(markets)) return {};

  const odds: Record<string, number> = {};

  for (const market of markets) {
    // Skip closed/resolved markets with near-zero probability
    const title: string = market.groupItemTitle ?? market.question ?? "";
    if (!title) continue;

    // Parse outcomePrices — it's a JSON string, not an array
    let prices: string[];
    try {
      prices = typeof market.outcomePrices === "string"
        ? JSON.parse(market.outcomePrices)
        : market.outcomePrices;
    } catch {
      continue;
    }

    if (!Array.isArray(prices) || prices.length === 0) continue;

    // "Yes" probability is at index 0
    const probability = parseFloat(prices[0]);
    if (isNaN(probability) || probability < 0.001) continue;

    // Try to match this market's title to an FYC nominee
    const normalizedTitle = normalize(title);
    const lookupKey = `${categoryId}:${normalizedTitle}`;
    const match = nomineeLookup.get(lookupKey);

    if (match) {
      odds[match.nomineeId] = probability;
    } else {
      // Fallback: try partial matching
      for (const [key, value] of nomineeLookup) {
        if (!key.startsWith(`${categoryId}:`)) continue;
        const nomName = key.split(":")[1];
        if (normalizedTitle.includes(nomName) || nomName.includes(normalizedTitle)) {
          odds[value.nomineeId] = probability;
          break;
        }
      }
    }
  }

  return odds;
}

async function fetchAllOdds(): Promise<OddsMap> {
  const entries = Object.entries(polymarketSlugs);
  const results: OddsMap = {};

  // Fetch all categories in parallel (batched to avoid rate limiting)
  const batchSize = 5;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(([catId, slug]) =>
        fetchCategoryOdds(catId, slug).then((odds) => ({ catId, odds }))
      )
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled" && Object.keys(result.value.odds).length > 0) {
        results[result.value.catId] = result.value.odds;
      }
    }
  }

  return results;
}

export async function GET() {
  const now = Date.now();

  // Serve from cache if fresh
  if (cachedOdds && now - cacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedOdds, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const odds = await fetchAllOdds();
    cachedOdds = odds;
    cacheTimestamp = now;

    return NextResponse.json(odds, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("[odds] fetch failed:", err);

    // Return stale cache if available
    if (cachedOdds) {
      return NextResponse.json(cachedOdds, {
        headers: {
          "Cache-Control": "public, s-maxage=60",
          "X-Cache": "STALE",
        },
      });
    }

    return NextResponse.json(
      {},
      { status: 200 } // Empty odds = graceful degradation
    );
  }
}
