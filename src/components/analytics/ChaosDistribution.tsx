"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChaosDistributionProps {
  data: Record<string, number>;
}

export default function ChaosDistribution({ data }: ChaosDistributionProps) {
  const chartData = Object.entries(data).map(([bucket, count]) => ({
    bucket,
    count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-muted text-sm">No data yet.</div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card-bg p-6">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-5">
        Chaos Score Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "var(--ink)",
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--gold)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
