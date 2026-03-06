import { Archetype, QuizQuestion } from "@/types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "It's Oscar night. What are you doing?",
    options: [
      {
        label: "Live-tweeting with frame-by-frame analysis of every montage",
        archetype: "film-bro",
      },
      {
        label: "Rooting for the most unhinged outcome possible",
        archetype: "chaos-agent",
      },
      {
        label: "I printed out my ballot and highlighted the frontrunners",
        archetype: "safe-picker",
      },
      {
        label: "Manifesting wins for movies nobody saw",
        archetype: "underdog-stan",
      },
    ],
  },
  {
    id: "q2",
    question: "Sinners has 16 nominations. You:",
    options: [
      {
        label: "Pull up the Letterboxd stats and explain why it deserves every one",
        archetype: "film-bro",
      },
      {
        label: "Vote against it in every category. Record-breakers must be humbled.",
        archetype: "chaos-agent",
      },
      {
        label: "Check which categories it's actually favored in and pick accordingly",
        archetype: "safe-picker",
      },
      {
        label: "Root for Train Dreams and The Lost Bus instead. The little guys need you.",
        archetype: "underdog-stan",
      },
    ],
  },
  {
    id: "q3",
    question: "Wicked: For Good got zero Oscar nominations. Your reaction?",
    options: [
      {
        label: "The Academy was right. That press tour was insufferable.",
        archetype: "film-bro",
      },
      {
        label: "Best thing to happen to the Oscars in years. Chaos reigns.",
        archetype: "chaos-agent",
      },
      {
        label: "The first one won two. Let it go.",
        archetype: "safe-picker",
      },
      {
        label: "Grande and Erivo deserved better. The Academy hates fun.",
        archetype: "underdog-stan",
      },
    ],
  },
  {
    id: "q4",
    question: "What's your relationship with Oscar predictions?",
    options: [
      {
        label: "I've studied every precursor award since the Gothams",
        archetype: "film-bro",
      },
      {
        label: "Predictions are boring. I pick with my heart (and spite)",
        archetype: "chaos-agent",
      },
      {
        label: "I check Gold Derby and go with the consensus. It works.",
        archetype: "safe-picker",
      },
      {
        label: "I intentionally pick against the frontrunners. Every time.",
        archetype: "underdog-stan",
      },
    ],
  },
];

export function computeArchetype(answers: Archetype[]): Archetype {
  const counts: Record<Archetype, number> = {
    "film-bro": 0,
    "chaos-agent": 0,
    "safe-picker": 0,
    "underdog-stan": 0,
  };

  for (const a of answers) {
    counts[a]++;
  }

  // Find the archetype with the most picks.
  // Ties broken by priority: chaos-agent > film-bro > underdog-stan > safe-picker
  const priority: Archetype[] = [
    "chaos-agent",
    "film-bro",
    "underdog-stan",
    "safe-picker",
  ];

  let best: Archetype = "safe-picker";
  let bestCount = 0;

  for (const arch of priority) {
    if (counts[arch] > bestCount) {
      best = arch;
      bestCount = counts[arch];
    }
  }

  return best;
}
