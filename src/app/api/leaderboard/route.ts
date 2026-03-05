import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId query param is required" },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  // Fetch winners
  const { data: winnerRows, error: winnersError } = await supabase
    .from("fyc_winners")
    .select("category_id, nominee_id");

  if (winnersError) {
    console.error("[leaderboard] winners query failed:", winnersError.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  const winners: Record<string, string> = {};
  for (const row of winnerRows ?? []) {
    winners[row.category_id] = row.nominee_id;
  }

  const announcedCount = Object.keys(winners).length;
  if (announcedCount === 0) {
    return NextResponse.json(
      { userScore: 0, announcedCategories: 0, percentile: 0, totalBallots: 0, scoreDistribution: {} },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
    );
  }

  // Fetch all ballots
  const { data: ballots, error: ballotsError } = await supabase
    .from("fyc_ballots")
    .select("session_id, picks");

  if (ballotsError) {
    console.error("[leaderboard] ballots query failed:", ballotsError.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  if (!ballots || ballots.length === 0) {
    return NextResponse.json(
      { userScore: 0, announcedCategories: announcedCount, percentile: 0, totalBallots: 0, scoreDistribution: {} },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
    );
  }

  // Compute scores
  let userScore = 0;
  const scores: number[] = [];
  const scoreDistribution: Record<number, number> = {};

  for (const ballot of ballots) {
    const picks = ballot.picks as Record<string, string>;
    let score = 0;
    for (const [catId, winnerId] of Object.entries(winners)) {
      if (picks[catId] === winnerId) score++;
    }
    scores.push(score);
    scoreDistribution[score] = (scoreDistribution[score] ?? 0) + 1;

    if (ballot.session_id === sessionId) {
      userScore = score;
    }
  }

  // Compute percentile (% of ballots the user beat)
  const beatCount = scores.filter((s) => s < userScore).length;
  const percentile = Math.round((beatCount / scores.length) * 100);

  return NextResponse.json(
    {
      userScore,
      announcedCategories: announcedCount,
      percentile,
      totalBallots: ballots.length,
      scoreDistribution,
    },
    {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    }
  );
}
