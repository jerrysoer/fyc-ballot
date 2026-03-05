import { frontrunners } from "@/data/frontrunners";
import { categories, SINNERS_NOMINEE_IDS, SINNERS_CATEGORY_IDS, SINNERS_TOTAL } from "@/data/nominees";

/**
 * Compute chaos score 0–100 based on how many picks disagree
 * with the Gold Derby frontrunners.
 *
 * Formula:
 * - Each category where a pick differs from the frontrunner scores 1 point.
 * - Each Sinners snub (not picking Sinners in a category where it's nominated)
 *   adds a fractional chaos bonus, normalized so avoiding Sinners entirely
 *   adds up to ~8 bonus points (scale factor to keep it meaningful without
 *   overwhelming the base chaos score).
 * - Score is normalized to 0–100.
 */
export function computeChaosScore(picks: Record<string, string>): number {
  let chaosPoints = 0;
  let pickCount = 0;

  for (const category of categories) {
    const pick = picks[category.id];
    if (!pick) continue;
    pickCount++;

    const frontrunner = frontrunners[category.id];
    if (frontrunner && pick !== frontrunner) {
      chaosPoints++;
    }
  }

  // Sinners contrarian bonus: snubbing the 16-nom record holder is chaotic
  const sinnersSnubs = getSinnersSnubCount(picks);
  const sinnersBonus = (sinnersSnubs / SINNERS_TOTAL) * 8;
  chaosPoints += sinnersBonus;

  if (pickCount === 0) return 50; // neutral default

  // Normalize: max chaos = all categories non-frontrunner + full sinners snub bonus
  const maxPoints = categories.length + 8;
  return Math.round((chaosPoints / maxPoints) * 100);
}

/**
 * Count how many times the user picked a Sinners nominee across all categories.
 */
export function getSinnersPickCount(picks: Record<string, string>): number {
  let count = 0;
  for (const [categoryId, nomineeId] of Object.entries(picks)) {
    if (SINNERS_CATEGORY_IDS.has(categoryId) && SINNERS_NOMINEE_IDS.has(nomineeId)) {
      count++;
    }
  }
  return count;
}

/**
 * Count how many times the user DIDN'T pick Sinners in categories where it's nominated.
 * Only counts categories where the user has made a pick.
 */
export function getSinnersSnubCount(picks: Record<string, string>): number {
  let snubs = 0;
  for (const categoryId of SINNERS_CATEGORY_IDS) {
    const pick = picks[categoryId];
    if (!pick) continue; // hasn't picked yet — not a snub
    if (!SINNERS_NOMINEE_IDS.has(pick)) {
      snubs++;
    }
  }
  return snubs;
}
