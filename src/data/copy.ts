import { Archetype } from "@/types";

export const archetypeReveals: Record<
  Archetype,
  { title: string; tagline: string; description: string }
> = {
  "film-bro": {
    title: "The Film Bro",
    tagline: "You've seen everything. Twice. In 70mm.",
    description:
      "You own at least one Criterion Blu-ray you haven't opened. Your Letterboxd profile has more followers than your Instagram. You'll explain why the Academy got it wrong within 30 seconds of any announcement.",
  },
  "chaos-agent": {
    title: "The Chaos Agent",
    tagline: "Some people just want to watch the Oscars burn.",
    description:
      "You didn't come here to predict — you came here to provoke. Your ballot is a manifesto. Every pick is designed to maximize the confusion of anyone who reads it.",
  },
  "safe-picker": {
    title: "The Safe Picker",
    tagline: "You read the room. The room is Gold Derby.",
    description:
      "You check the odds. You follow the precursors. You know what BAFTA means and you use it. Your ballot is a masterclass in probability — bold it is not.",
  },
  "underdog-stan": {
    title: "The Underdog Stan",
    tagline: "If it's popular, it's wrong.",
    description:
      "You root for the movie with 200 Letterboxd reviews. You think 'crowd-pleaser' is an insult. Your ballot is an act of rebellion against the mainstream — which is basically its own form of mainstream now, but we won't tell.",
  },
};

export const chaosTaunts: Record<string, string> = {
  "0-10": "Wow, a perfect score in cowardice. Your ballot is a Gold Derby screenshot. You probably think the Wicked snub was justified too.",
  "11-20": "Playing it safe? Your picks have the personality of a studio press release.",
  "21-35": "A dash of rebellion. You've got PTA energy — inevitable, unstoppable, and just a little smug about it.",
  "36-50": "Walking the line between taste and chaos. Perfectly balanced — like Coogler's composure at the BAFTAs.",
  "51-65": "Now we're talking. Your ballot has character. Questionable character, but character.",
  "66-80": "You're out here swinging. Half these picks will age like milk and you don't care.",
  "81-90": "Absolute menace energy. Your ballot reads like a dare.",
  "91-100": "Pure chaos. You'd nominate Wicked: For Good just to watch the Academy squirm. Ariana Grande would be proud.",
};

export function getChaosTaunt(score: number): string {
  if (score <= 10) return chaosTaunts["0-10"];
  if (score <= 20) return chaosTaunts["11-20"];
  if (score <= 35) return chaosTaunts["21-35"];
  if (score <= 50) return chaosTaunts["36-50"];
  if (score <= 65) return chaosTaunts["51-65"];
  if (score <= 80) return chaosTaunts["66-80"];
  if (score <= 90) return chaosTaunts["81-90"];
  return chaosTaunts["91-100"];
}

/**
 * Sinners loyalty messages — based on how many of the 16 Sinners
 * nominees the user picked across the ballot.
 */
export const sinnersLoyaltyTiers = {
  skeptic: {
    range: [0, 3] as const,
    title: "The Sinners Skeptic",
    message: "You think 16 noms is overblown. Ryan Coogler will remember this.",
  },
  fence: {
    range: [4, 8] as const,
    title: "The Fence-Sitter",
    message: "You respect Sinners but don't worship it. How diplomatic of you.",
  },
  believer: {
    range: [9, 12] as const,
    title: "The True Believer",
    message: "Ryan Coogler could run for office with your support.",
  },
  stan: {
    range: [13, 16] as const,
    title: "Full Sinners Stan",
    message: "You'd give it Best Animated Short if you could.",
  },
};

export function getSinnersLoyaltyTier(count: number) {
  if (count <= 3) return sinnersLoyaltyTiers.skeptic;
  if (count <= 8) return sinnersLoyaltyTiers.fence;
  if (count <= 12) return sinnersLoyaltyTiers.believer;
  return sinnersLoyaltyTiers.stan;
}

export const chaosLabels: Record<string, string> = {
  "0-20": "Academy Approved™",
  "21-40": "Mild Spice",
  "41-60": "Interesting Choices",
  "61-80": "Unhinged Energy",
  "81-100": "Full Chaos Mode",
};

export function getChaosLabel(score: number): string {
  if (score <= 20) return chaosLabels["0-20"];
  if (score <= 40) return chaosLabels["21-40"];
  if (score <= 60) return chaosLabels["41-60"];
  if (score <= 80) return chaosLabels["61-80"];
  return chaosLabels["81-100"];
}
