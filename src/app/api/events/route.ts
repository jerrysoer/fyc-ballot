import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { eventBodySchema } from "@/lib/event-validation";

const MINUTE_MS = 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // Rate limit: 30 events per minute per IP
  const rl = rateLimit(ip, 30, MINUTE_MS);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many events. Slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = eventBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid event data", details: parsed.error.flatten() },
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

  const { event, sessionId, data } = parsed.data;

  const { error } = await supabase.from("fyc_events").insert({
    event_name: event,
    session_id: sessionId ?? null,
    metadata: data ?? {},
  });

  if (error) {
    console.error("[events] insert failed:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
