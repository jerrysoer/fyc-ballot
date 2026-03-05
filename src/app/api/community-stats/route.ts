import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  const { data: ballots, error } = await supabase
    .from("fyc_ballots")
    .select("picks");

  if (error) {
    console.error("[community-stats] query failed:", error.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  if (!ballots || ballots.length === 0) {
    return NextResponse.json(
      {},
      {
        headers: {
          "Cache-Control": "s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  }

  const totalBallots = ballots.length;

  // Count picks per nominee per category
  const counts: Record<string, Record<string, number>> = {};
  for (const b of ballots) {
    const picks = b.picks as Record<string, string>;
    for (const [catId, nomId] of Object.entries(picks)) {
      if (!counts[catId]) counts[catId] = {};
      counts[catId][nomId] = (counts[catId][nomId] ?? 0) + 1;
    }
  }

  // Convert to percentages
  const stats: Record<string, Record<string, number>> = {};
  for (const [catId, nominees] of Object.entries(counts)) {
    stats[catId] = { total: totalBallots };
    for (const [nomId, count] of Object.entries(nominees)) {
      stats[catId][nomId] = Math.round((count / totalBallots) * 100);
    }
  }

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=300",
    },
  });
}
