/**
 * Maps FYC category IDs to Polymarket event slugs.
 * Slug format: oscars-2026-{category-slug}
 *
 * Not all categories have Polymarket markets (shorts, docs, casting may not).
 * Missing slugs degrade gracefully — no odds shown for those categories.
 */
export const polymarketSlugs: Record<string, string> = {
  "best-picture": "oscars-2026-best-picture-winner",
  "best-director": "oscars-2026-best-director-winner",
  "best-actress": "oscars-2026-best-actress-winner",
  "best-actor": "oscars-2026-best-actor-winner",
  "best-supporting-actress": "oscars-2026-best-supporting-actress-winner",
  "best-supporting-actor": "oscars-2026-best-supporting-actor-winner",
  "best-adapted-screenplay": "oscars-2026-best-adapted-screenplay-winner",
  "best-original-screenplay": "oscars-2026-best-original-screenplay-winner",
  "best-animated-feature": "oscars-2026-best-animated-feature-winner",
  "best-original-score": "oscars-2026-best-original-score-winner",
};
