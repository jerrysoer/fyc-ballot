"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ArchetypeChartProps {
  data: Record<string, number>;
}

const ARCHETYPE_COLORS: Record<string, string> = {
  "film-bro": "#C9963A",
  "chaos-agent": "#C43E1C",
  "safe-picker": "#2B5F8E",
  "underdog-stan": "#8C7B65",
};

const ARCHETYPE_LABELS: Record<string, string> = {
  "film-bro": "Film Bro",
  "chaos-agent": "Chaos Agent",
  "safe-picker": "Safe Picker",
  "underdog-stan": "Underdog Stan",
};

export default function ArchetypeChart({ data }: ArchetypeChartProps) {
  const chartData = Object.entries(data).map(([archetype, count]) => ({
    name: ARCHETYPE_LABELS[archetype] ?? archetype,
    value: count,
    color: ARCHETYPE_COLORS[archetype] ?? "#8C7B65",
  }));

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-muted text-sm">No data yet.</div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card-bg p-6">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-5">
        Archetype Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "var(--ink)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
