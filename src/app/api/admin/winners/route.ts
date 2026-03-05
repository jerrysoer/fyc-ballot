import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { categories } from "@/data/nominees";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  const decoded = atob(auth.slice(6));
  const [user, pass] = decoded.split(":");
  return user === process.env.AUTH_USER && pass === process.env.AUTH_PASSWORD;
}

function validateCategoryNominee(categoryId: string, nomineeId: string): string | null {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return `Unknown category: ${categoryId}`;
  const nom = cat.nominees.find((n) => n.id === nomineeId);
  if (!nom) return `Unknown nominee: ${nomineeId} in category ${categoryId}`;
  return null;
}

// GET — public, returns current winners
export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { winners: {} },
      {
        headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
      }
    );
  }

  const { data, error } = await supabase
    .from("fyc_winners")
    .select("category_id, nominee_id");

  if (error) {
    console.error("[admin/winners] query failed:", error.message);
    return NextResponse.json({ winners: {} });
  }

  const winners: Record<string, string> = {};
  for (const row of data ?? []) {
    winners[row.category_id] = row.nominee_id;
  }

  return NextResponse.json(
    { winners },
    {
      headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
    }
  );
}

// POST — auth required, set a winner
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { categoryId?: string; nomineeId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { categoryId, nomineeId } = body;
  if (!categoryId || !nomineeId) {
    return NextResponse.json(
      { error: "categoryId and nomineeId are required" },
      { status: 400 }
    );
  }

  const validationError = validateCategoryNominee(categoryId, nomineeId);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from("fyc_winners")
    .upsert({ category_id: categoryId, nominee_id: nomineeId });

  if (error) {
    console.error("[admin/winners] upsert failed:", error.message);
    return NextResponse.json({ error: "Failed to set winner" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — auth required, remove a winner
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { categoryId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { categoryId } = body;
  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId is required" },
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

  const { error } = await supabase
    .from("fyc_winners")
    .delete()
    .eq("category_id", categoryId);

  if (error) {
    console.error("[admin/winners] delete failed:", error.message);
    return NextResponse.json({ error: "Failed to remove winner" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
