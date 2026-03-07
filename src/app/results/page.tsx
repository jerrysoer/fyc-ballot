import type { Metadata } from "next";
import ResultsClient from "./ResultsClient";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

const archetypeTitles: Record<string, string> = {
  "film-bro": "The Film Bro",
  "chaos-agent": "The Chaos Agent",
  "safe-picker": "The Safe Picker",
  "underdog-stan": "The Underdog Stan",
};

// Static export (GitHub Pages) can't use searchParams in metadata — every
// request gets the same HTML.  Dynamic OG cards only work on the Vercel
// deployment where generateMetadata can read query params at request time.
const isStatic = process.env.BUILD_MODE === "static";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(
  props: Props,
): Promise<Metadata> {
  if (isStatic) {
    return {
      title: "Your Results — 98th Oscars Ballot",
      description:
        "See your chaos score, archetype, and how your picks compare to the market.",
    };
  }

  const params = await props.searchParams;
  const score = params.score as string | undefined;
  const archetype = params.archetype as string | undefined;
  const picks = params.picks as string | undefined;

  // If share params are present, generate a personalized OG image
  if (score && archetype) {
    const ogParams = new URLSearchParams({
      score,
      archetype,
      ...(picks ? { picks } : {}),
    });
    const ogUrl = `${apiBase}/api/og/results?${ogParams.toString()}`;
    const title = archetypeTitles[archetype] ?? "The Wildcard";

    return {
      title: `${title} — 98th Oscars Ballot`,
      description: `Chaos score: ${score}/100. Think you can do better? Fill out your own ballot and get roasted.`,
      openGraph: {
        title: `${title} — 98th Oscars Ballot`,
        description: `Chaos score: ${score}/100. Think you can do better?`,
        type: "website",
        images: [{ url: ogUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} — 98th Oscars Ballot`,
        description: `Chaos score: ${score}/100. Think you can do better?`,
        images: [ogUrl],
      },
    };
  }

  // Default metadata (no share params — user viewing their own results)
  return {
    title: "Your Results — 98th Oscars Ballot",
    description:
      "See your chaos score, archetype, and how your picks compare to the market.",
  };
}

export default function ResultsPage() {
  return <ResultsClient />;
}
