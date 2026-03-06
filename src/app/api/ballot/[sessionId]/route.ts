import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

const MINUTE_MS = 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** GET /api/ballot/:sessionId — read-only ballot lookup for friend comparison */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const ip = getIp(req);

  // Rate limit: 30 reads per minute per IP
  const rl = rateLimit(ip, 30, MINUTE_MS);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // Basic input validation
  if (!sessionId || sessionId.length > 64) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("fyc_ballots")
    .select("archetype, picks, chaos_score")
    .eq("session_id", sessionId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Ballot not found" }, { status: 404 });
  }

  // Return only non-PII ballot data
  return NextResponse.json({
    archetype: data.archetype,
    picks: data.picks,
    chaosScore: data.chaos_score,
  });
}
