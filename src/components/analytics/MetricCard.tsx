"use client";

interface MetricCardProps {
  label: string;
  value: string | number;
  featured?: boolean;
}

export default function MetricCard({ label, value, featured }: MetricCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all ${
        featured
          ? "bg-gold/[0.04] border-gold/20 p-6"
          : "bg-card-bg border-border p-5"
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.06] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      )}
      <p className="relative text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-3">
        {label}
      </p>
      <div className="relative">
        <span
          className={`font-mono tracking-tight tabular-nums ${
            featured ? "text-4xl font-medium text-ink" : "text-3xl font-medium text-ink"
          }`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
    </div>
  );
}
