import MetricCard from "@/components/analytics/MetricCard";
import ArchetypeChart from "@/components/analytics/ArchetypeChart";
import ChaosDistribution from "@/components/analytics/ChaosDistribution";
import TopPicksTable from "@/components/analytics/TopPicksTable";
import SubmissionsOverTime from "@/components/analytics/SubmissionsOverTime";
import WinnerMarker from "@/components/admin/WinnerMarker";

interface DashboardData {
  totalBallots: number;
  archetypes: Record<string, number>;
  chaosBuckets: Record<string, number>;
  topPicks: Record<string, { nomineeId: string; count: number; percentage: number }>;
  dailySubmissions: { date: string; count: number }[];
  avgChaosScore: number;
  avgSinnersLoyalty: number;
  totalEvents: number;
  eventCounts: Record<string, number>;
  dailyEventSubmissions: { date: string; count: number }[];
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
      cache: "no-store",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.AUTH_USER}:${process.env.AUTH_PASSWORD}`
        ).toString("base64")}`,
      },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-ink mb-2">
            Dashboard Unavailable
          </h1>
          <p className="text-muted">
            Could not load analytics data. Check your Supabase connection.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-mono text-muted uppercase tracking-widest mb-1">
            Admin
          </p>
          <h1 className="font-serif text-3xl font-bold text-ink">
            FYC Analytics Dashboard
          </h1>
        </div>

        {/* Winner marking — ceremony night controls */}
        <WinnerMarker />

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total Ballots"
            value={data.totalBallots}
            featured
          />
          <MetricCard
            label="Avg Chaos Score"
            value={data.avgChaosScore}
          />
          <MetricCard
            label="Avg Sinners Loyalty"
            value={`${data.avgSinnersLoyalty}%`}
          />
          <MetricCard
            label="Archetypes"
            value={Object.keys(data.archetypes).length}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ArchetypeChart data={data.archetypes} />
          <ChaosDistribution data={data.chaosBuckets} />
        </div>

        {/* Charts row 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <SubmissionsOverTime data={data.dailySubmissions} label="Ballot Submissions Over Time" />
          <TopPicksTable data={data.topPicks} />
        </div>

        {/* Event Activity */}
        <div className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">
            Event Activity
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Total Events" value={data.totalEvents} featured />
            {Object.entries(data.eventCounts).map(([name, count]) => (
              <MetricCard key={name} label={name} value={count} />
            ))}
          </div>
          {data.dailyEventSubmissions.length > 0 && (
            <SubmissionsOverTime data={data.dailyEventSubmissions} label="Events Over Time" />
          )}
        </div>
      </div>
    </main>
  );
}
