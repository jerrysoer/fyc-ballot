import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { totalBallots: 0 },
      {
        status: 200,
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
      }
    );
  }

  const { count: totalBallots } = await supabase
    .from("fyc_ballots")
    .select("*", { count: "exact", head: true });

  return NextResponse.json(
    {
      totalBallots: totalBallots ?? 0,
    },
    {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
    }
  );
}
