import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { ballotBodySchema, validatePicks } from "@/lib/validation";
import { computeChaosScore } from "@/lib/chaos";

const HOUR_MS = 60 * 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// POST — create a new ballot
export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // Rate limit: 5 creates per hour
  const rl = rateLimit(ip, 5, HOUR_MS);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ballotBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid ballot data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { sessionId, archetype, picks } = parsed.data;

  // Validate picks against allowlist
  const picksError = validatePicks(picks);
  if (picksError) {
    return NextResponse.json({ error: picksError }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  // Server-side chaos score recomputation
  const chaosScore = computeChaosScore(picks);

  const { error } = await supabase.from("fyc_ballots").insert({
    session_id: sessionId,
    archetype,
    picks,
    chaos_score: chaosScore,
  });

  if (error) {
    // Duplicate session — treat as success
    if (error.code === "23505") {
      return NextResponse.json({ success: true });
    }
    console.error("[ballot] insert failed:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PUT — update an existing ballot
export async function PUT(req: NextRequest) {
  const ip = getIp(req);

  // Rate limit: 60 updates per hour
  const rl = rateLimit(ip, 60, HOUR_MS);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many updates. Slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ballotBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid ballot data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { sessionId, archetype, picks } = parsed.data;

  const picksError = validatePicks(picks);
  if (picksError) {
    return NextResponse.json({ error: picksError }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  const chaosScore = computeChaosScore(picks);

  const { error } = await supabase
    .from("fyc_ballots")
    .update({
      archetype,
      picks,
      chaos_score: chaosScore,
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId);

  if (error) {
    console.error("[ballot] update failed:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
