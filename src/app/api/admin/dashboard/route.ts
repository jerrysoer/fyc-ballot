import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSinnersPickCount } from "@/lib/chaos";
import { SINNERS_TOTAL } from "@/data/nominees";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Fetch all ballots for aggregation
  const { data: ballots, error } = await supabase
    .from("fyc_ballots")
    .select("archetype, picks, chaos_score, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/dashboard] query failed:", error.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  if (!ballots || ballots.length === 0) {
    return NextResponse.json({
      totalBallots: 0,
      archetypes: {},
      chaosBuckets: {},
      topPicks: {},
      dailySubmissions: [],
      avgChaosScore: 0,
      avgSinnersLoyalty: 0,
      totalEvents: 0,
      eventCounts: {},
      dailyEventSubmissions: [],
    });
  }

  // Archetype distribution
  const archetypes: Record<string, number> = {};
  for (const b of ballots) {
    archetypes[b.archetype] = (archetypes[b.archetype] ?? 0) + 1;
  }

  // Chaos score buckets
  const chaosBuckets: Record<string, number> = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61-80": 0,
    "81-100": 0,
  };
  let totalChaos = 0;
  for (const b of ballots) {
    totalChaos += b.chaos_score;
    if (b.chaos_score <= 20) chaosBuckets["0-20"]++;
    else if (b.chaos_score <= 40) chaosBuckets["21-40"]++;
    else if (b.chaos_score <= 60) chaosBuckets["41-60"]++;
    else if (b.chaos_score <= 80) chaosBuckets["61-80"]++;
    else chaosBuckets["81-100"]++;
  }

  // Most picked nominee per category
  const pickCounts: Record<string, Record<string, number>> = {};
  let totalSinnersLoyalty = 0;
  for (const b of ballots) {
    const picks = b.picks as Record<string, string>;
    for (const [catId, nomId] of Object.entries(picks)) {
      if (!pickCounts[catId]) pickCounts[catId] = {};
      pickCounts[catId][nomId] = (pickCounts[catId][nomId] ?? 0) + 1;
    }
    totalSinnersLoyalty += getSinnersPickCount(picks);
  }

  const topPicks: Record<string, { nomineeId: string; count: number; percentage: number }> = {};
  for (const [catId, nominees] of Object.entries(pickCounts)) {
    let topNominee = "";
    let topCount = 0;
    for (const [nomId, count] of Object.entries(nominees)) {
      if (count > topCount) {
        topNominee = nomId;
        topCount = count;
      }
    }
    topPicks[catId] = {
      nomineeId: topNominee,
      count: topCount,
      percentage: Math.round((topCount / ballots.length) * 100),
    };
  }

  // Daily submissions
  const dailyMap = new Map<string, number>();
  for (const b of ballots) {
    const day = b.created_at.slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }
  const dailySubmissions = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // Event analytics
  let totalEvents = 0;
  let eventCounts: Record<string, number> = {};
  let dailyEventSubmissions: { date: string; count: number }[] = [];

  const { data: events, error: eventsError } = await supabase
    .from("fyc_events")
    .select("event_name, created_at")
    .order("created_at", { ascending: true });

  if (!eventsError && events && events.length > 0) {
    totalEvents = events.length;

    for (const e of events) {
      eventCounts[e.event_name] = (eventCounts[e.event_name] ?? 0) + 1;
    }

    const dailyEventMap = new Map<string, number>();
    for (const e of events) {
      const day = e.created_at.slice(0, 10);
      dailyEventMap.set(day, (dailyEventMap.get(day) ?? 0) + 1);
    }
    dailyEventSubmissions = Array.from(dailyEventMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  return NextResponse.json({
    totalBallots: ballots.length,
    archetypes,
    chaosBuckets,
    topPicks,
    dailySubmissions,
    avgChaosScore: Math.round(totalChaos / ballots.length),
    avgSinnersLoyalty: Math.round((totalSinnersLoyalty / ballots.length / SINNERS_TOTAL) * 100),
    totalEvents,
    eventCounts,
    dailyEventSubmissions,
  });
}
