import { categories, SINNERS_NOMINEE_IDS } from "@/data/nominees";
import { frontrunners } from "@/data/frontrunners";
import { getSinnersLoyaltyTier } from "@/data/copy";
import { getSinnersPickCount } from "./chaos";

interface Roast {
  message: string;
  type: "streak" | "pattern" | "sinners" | "milestone";
}

/**
 * Analyze the current ballot and generate contextual mid-ballot roasts.
 * Called at milestone categories (8, 16, 24) to keep engagement high.
 */
export function getMidBallotRoast(
  picks: Record<string, string>,
  currentIndex: number,
): Roast | null {
  const len = categories.length;
  const milestones = [
    Math.floor(len / 3) - 1,
    Math.floor((2 * len) / 3) - 1,
    len - 1,
  ];
  if (!milestones.includes(currentIndex)) return null;

  const roasts: Roast[] = [];

  // Streak detection: consecutive frontrunner picks
  const frontrunnerStreak = detectFrontrunnerStreak(picks);
  if (frontrunnerStreak >= 3) {
    roasts.push({
      message: `${frontrunnerStreak} frontrunners in a row? You're basically a press release with legs.`,
      type: "streak",
    });
  }

  // Sinners context roast (show after halfway)
  const sinnersCount = getSinnersPickCount(picks);
  if (currentIndex >= milestones[1]) {
    const tier = getSinnersLoyaltyTier(sinnersCount);
    if (sinnersCount === 0 && Object.keys(picks).length >= Math.floor(len / 2)) {
      roasts.push({
        message: "Not a single Sinners pick? Ryan Coogler's masterpiece means nothing to you?",
        type: "sinners",
      });
    } else if (sinnersCount >= 4) {
      roasts.push({
        message: `${tier.title}. At this point, your ballot IS a Sinners campaign.`,
        type: "sinners",
      });
    }
  }

  // Film concentration detection
  const filmConcentration = detectFilmConcentration(picks);
  if (filmConcentration) {
    roasts.push(filmConcentration);
  }

  // Anti-frontrunner streak
  const antiStreak = detectAntiStreak(picks);
  if (antiStreak >= 5) {
    roasts.push({
      message: `${antiStreak} non-frontrunner picks? This isn't a ballot, it's a manifesto.`,
      type: "streak",
    });
  }

  // Milestone roasts
  if (currentIndex === milestones[0] && Object.keys(picks).length >= milestones[0] + 1) {
    roasts.push({
      message: "One-third done. Your choices are being judged by an AI. No pressure.",
      type: "milestone",
    });
  } else if (currentIndex === milestones[1] && Object.keys(picks).length >= milestones[1] + 1) {
    roasts.push({
      message: "Halfway there. Your ballot personality is forming. It's... interesting.",
      type: "milestone",
    });
  } else if (currentIndex === milestones[2] && Object.keys(picks).length >= milestones[2] + 1) {
    roasts.push({
      message: "Almost done. Whatever happens next defines you. Choose wisely. Or don't.",
      type: "milestone",
    });
  }

  // Return the most specific roast (prefer pattern > sinners > streak > milestone)
  const priority: Roast["type"][] = ["pattern", "sinners", "streak", "milestone"];
  for (const type of priority) {
    const match = roasts.find((r) => r.type === type);
    if (match) return match;
  }

  return roasts[0] ?? null;
}

function detectFrontrunnerStreak(picks: Record<string, string>): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const cat of categories) {
    const pick = picks[cat.id];
    if (!pick) continue;

    if (frontrunners[cat.id] === pick) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

function detectAntiStreak(picks: Record<string, string>): number {
  let streak = 0;
  for (const cat of categories) {
    const pick = picks[cat.id];
    if (!pick) continue;
    if (frontrunners[cat.id] && frontrunners[cat.id] !== pick) {
      streak++;
    }
  }
  return streak;
}

function detectFilmConcentration(picks: Record<string, string>): Roast | null {
  // Count how many times each film appears across picks
  const filmCounts = new Map<string, number>();

  for (const cat of categories) {
    const pick = picks[cat.id];
    if (!pick) continue;
    const nominee = cat.nominees.find((n) => n.id === pick);
    if (!nominee) continue;

    const film = nominee.film;
    filmCounts.set(film, (filmCounts.get(film) ?? 0) + 1);
  }

  // Ignore Sinners (handled separately)
  for (const [film, count] of filmCounts) {
    if (count >= 4 && !SINNERS_NOMINEE_IDS.has(film)) {
      return {
        message: `You picked ${film} in ${count} categories. Do you work for that studio?`,
        type: "pattern",
      };
    }
  }

  return null;
}
