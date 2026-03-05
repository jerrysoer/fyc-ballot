"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface SubmissionsOverTimeProps {
  data: { date: string; count: number }[];
  label?: string;
}

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function SubmissionsOverTime({ data, label = "Submissions Over Time" }: SubmissionsOverTimeProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted text-sm">No submission data yet.</div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card-bg p-6">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-5">
        {label}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.25} />
                <stop offset="60%" stopColor="var(--gold)" stopOpacity={0.06} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
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
              labelFormatter={(l) => formatDate(String(l))}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--gold)"
              strokeWidth={2}
              fill="url(#submissionsGradient)"
              dot={false}
              activeDot={{
                r: 4,
                stroke: "var(--gold)",
                strokeWidth: 2,
                fill: "var(--card-bg)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
