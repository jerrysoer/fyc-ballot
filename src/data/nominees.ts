import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "best-picture",
    name: "Best Picture",
    appComment: "The one everyone pretends to have seen. Pick wisely — or don't. We'll judge either way.",
    nominees: [
      { id: "bugonia", name: "Bugonia", film: "Bugonia" },
      { id: "f1", name: "F1", film: "F1" },
      { id: "frankenstein", name: "Frankenstein", film: "Frankenstein" },
      { id: "hamnet", name: "Hamnet", film: "Hamnet" },
      { id: "marty-supreme", name: "Marty Supreme", film: "Marty Supreme" },
      { id: "one-battle", name: "One Battle After Another", film: "One Battle After Another", isFrontrunner: true },
      { id: "secret-agent", name: "The Secret Agent", film: "The Secret Agent" },
      { id: "sentimental-value", name: "Sentimental Value", film: "Sentimental Value" },
      { id: "sinners", name: "Sinners", film: "Sinners" },
      { id: "train-dreams", name: "Train Dreams", film: "Train Dreams" },
    ],
  },
  {
    id: "best-director",
    name: "Best Director",
    appComment: "Who yelled 'cut' the best? Auteur theory is just astrology for film bros.",
    nominees: [
      { id: "dir-pta", name: "Paul Thomas Anderson", film: "One Battle After Another", isFrontrunner: true },
      { id: "dir-coogler", name: "Ryan Coogler", film: "Sinners" },
      { id: "dir-zhao", name: "Chloé Zhao", film: "Hamnet" },
      { id: "dir-safdie", name: "Josh Safdie", film: "Marty Supreme" },
      { id: "dir-trier", name: "Joachim Trier", film: "Sentimental Value" },
    ],
  },
  {
    id: "best-actress",
    name: "Best Actress",
    appComment: "Who cried the hardest while making it look effortless? Time to pretend you've seen all five.",
    nominees: [
      { id: "actress-buckley", name: "Jessie Buckley", film: "Hamnet", isFrontrunner: true },
      { id: "actress-byrne", name: "Rose Byrne", film: "If I Had Legs I'd Kick You" },
      { id: "actress-reinsve", name: "Renate Reinsve", film: "Sentimental Value" },
      { id: "actress-stone", name: "Emma Stone", film: "Bugonia" },
      { id: "actress-hudson", name: "Kate Hudson", film: "Song Sung Blue" },
    ],
  },
  {
    id: "best-actor",
    name: "Best Actor",
    appComment: "Someone lost 40 pounds for this. Another gained 40. Hollywood's idea of range.",
    nominees: [
      { id: "actor-chalamet", name: "Timothée Chalamet", film: "Marty Supreme", isFrontrunner: true },
      { id: "actor-dicaprio", name: "Leonardo DiCaprio", film: "One Battle After Another" },
      { id: "actor-hawke", name: "Ethan Hawke", film: "Blue Moon" },
      { id: "actor-jordan", name: "Michael B. Jordan", film: "Sinners" },
      { id: "actor-moura", name: "Wagner Moura", film: "The Secret Agent" },
    ],
  },
  {
    id: "best-supporting-actress",
    name: "Best Supporting Actress",
    appComment: "The 'I carried this movie but okay call it supporting' award.",
    nominees: [
      { id: "sa-fanning", name: "Elle Fanning", film: "Sentimental Value" },
      { id: "sa-lilleaas", name: "Inga Ibsdotter Lilleaas", film: "Sentimental Value" },
      { id: "sa-madigan", name: "Amy Madigan", film: "Weapons" },
      { id: "sa-mosaku", name: "Wunmi Mosaku", film: "Sinners" },
      { id: "sa-taylor", name: "Teyana Taylor", film: "One Battle After Another", isFrontrunner: true },
    ],
  },
  {
    id: "best-supporting-actor",
    name: "Best Supporting Actor",
    appComment: "15 minutes of screen time, a lifetime of campaigning. Welcome to Hollywood math.",
    nominees: [
      { id: "sup-elordi", name: "Jacob Elordi", film: "Frankenstein" },
      { id: "sup-penn", name: "Sean Penn", film: "One Battle After Another" },
      { id: "sup-skarsgard", name: "Stellan Skarsgård", film: "Sentimental Value", isFrontrunner: true },
      { id: "sup-deltoro", name: "Benicio del Toro", film: "One Battle After Another" },
      { id: "sup-lindo", name: "Delroy Lindo", film: "Sinners" },
    ],
  },
  {
    id: "best-adapted-screenplay",
    name: "Best Adapted Screenplay",
    appComment: "Someone else did the hard part. These writers just... adapted. How brave.",
    nominees: [
      { id: "as-bugonia", name: "Bugonia", film: "Bugonia" },
      { id: "as-frankenstein", name: "Frankenstein", film: "Frankenstein" },
      { id: "as-hamnet", name: "Hamnet", film: "Hamnet" },
      { id: "as-one-battle", name: "One Battle After Another", film: "One Battle After Another", isFrontrunner: true },
      { id: "as-train-dreams", name: "Train Dreams", film: "Train Dreams" },
    ],
  },
  {
    id: "best-original-screenplay",
    name: "Best Original Screenplay",
    appComment: "Actually original. No IP, no franchise, no safety net. Respect... but also, bold strategy.",
    nominees: [
      { id: "os-blue-moon", name: "Blue Moon", film: "Blue Moon" },
      { id: "os-accident", name: "It Was Just an Accident", film: "It Was Just an Accident" },
      { id: "os-marty", name: "Marty Supreme", film: "Marty Supreme" },
      { id: "os-sentimental", name: "Sentimental Value", film: "Sentimental Value" },
      { id: "os-sinners", name: "Sinners", film: "Sinners", isFrontrunner: true },
    ],
  },
  {
    id: "best-animated-feature",
    name: "Best Animated Feature",
    appComment: "Adults pretending they're watching for their kids. We see you.",
    nominees: [
      { id: "af-arco", name: "Arco", film: "Arco" },
      { id: "af-elio", name: "Elio", film: "Elio" },
      { id: "af-kpop", name: "KPop Demon Hunters", film: "KPop Demon Hunters", isFrontrunner: true },
      { id: "af-amelie", name: "Little Amélie or the Character of Rain", film: "Little Amélie" },
      { id: "af-zootopia", name: "Zootopia 2", film: "Zootopia 2" },
    ],
  },
  {
    id: "best-original-score",
    name: "Best Original Score",
    appComment: "Music that made you feel things you didn't consent to feeling.",
    nominees: [
      { id: "sc-bugonia", name: "Jerskin Fendrix", film: "Bugonia" },
      { id: "sc-frankenstein", name: "Alexandre Desplat", film: "Frankenstein" },
      { id: "sc-hamnet", name: "Max Richter", film: "Hamnet" },
      { id: "sc-one-battle", name: "Jonny Greenwood", film: "One Battle After Another" },
      { id: "sc-sinners", name: "Ludwig Göransson", film: "Sinners", isFrontrunner: true },
    ],
  },
];

export const TOTAL_CATEGORIES = categories.length;

/**
 * All nominee IDs that represent a Sinners pick.
 * Sinners appears in 5 of the 10 ballot categories.
 */
export const SINNERS_NOMINEE_IDS = new Set([
  "sinners",        // Best Picture
  "dir-coogler",    // Best Director
  "actor-jordan",   // Best Actor
  "os-sinners",     // Best Original Screenplay
  "sc-sinners",     // Best Original Score
]);

/** Category IDs where Sinners is nominated */
export const SINNERS_CATEGORY_IDS = new Set([
  "best-picture",
  "best-director",
  "best-actor",
  "best-original-screenplay",
  "best-original-score",
]);

export const SINNERS_TOTAL = SINNERS_NOMINEE_IDS.size;
