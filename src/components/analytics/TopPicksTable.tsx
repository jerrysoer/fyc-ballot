"use client";

import { categories } from "@/data/nominees";

interface TopPicksTableProps {
  data: Record<string, { nomineeId: string; count: number; percentage: number }>;
}

export default function TopPicksTable({ data }: TopPicksTableProps) {
  const rows = categories
    .filter((c) => data[c.id])
    .map((cat) => {
      const pick = data[cat.id];
      const nominee = cat.nominees.find((n) => n.id === pick.nomineeId);
      return {
        category: cat.name,
        nominee: nominee?.name ?? pick.nomineeId,
        percentage: pick.percentage,
      };
    });

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-muted text-sm">No data yet.</div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card-bg p-6">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-5">
        Most Picked Per Category
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-muted w-40 truncate shrink-0">
              {row.category}
            </span>
            <div className="flex-1 relative">
              <div className="h-5 bg-gold/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold/40 rounded-full transition-all"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-mono text-ink w-20 truncate shrink-0">
              {row.nominee}
            </span>
            <span className="text-xs font-mono text-muted w-10 text-right shrink-0">
              {row.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
