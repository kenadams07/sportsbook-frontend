import { prisma } from "../db/client.js";
import { getQuotaStatus } from "./quota.service.js";

function metricLine(name: string, value: number) {
  return `${name} ${value}`;
}

function nullableMetricValue(value: number | null) {
  return value ?? 0;
}

export async function getMetricsText(): Promise<string> {
  const [quota, activeSports, totalEvents, liveEvents, oddsSnapshots] =
    await Promise.all([
      getQuotaStatus(),
      prisma.leagueConfig.count({
        where: {
          enabled: true,
        },
      }),
      prisma.event.count(),
      prisma.event.count({
        where: {
          status: "LIVE",
        },
      }),
      prisma.oddsSnapshot.count(),
    ]);

  return [
    "# HELP odds_active_sports Number of enabled sport polling configs.",
    "# TYPE odds_active_sports gauge",
    metricLine("odds_active_sports", activeSports),
    "# HELP odds_events_total Number of events stored in the database.",
    "# TYPE odds_events_total gauge",
    metricLine("odds_events_total", totalEvents),
    "# HELP odds_live_events Number of events currently marked live.",
    "# TYPE odds_live_events gauge",
    metricLine("odds_live_events", liveEvents),
    "# HELP odds_snapshots_total Number of odds history rows stored.",
    "# TYPE odds_snapshots_total gauge",
    metricLine("odds_snapshots_total", oddsSnapshots),
    "# HELP odds_quota_remaining Latest Odds API remaining request quota.",
    "# TYPE odds_quota_remaining gauge",
    metricLine("odds_quota_remaining", nullableMetricValue(quota.remaining)),
    "# HELP odds_quota_used Latest Odds API used request quota.",
    "# TYPE odds_quota_used gauge",
    metricLine("odds_quota_used", nullableMetricValue(quota.used)),
    "",
  ].join("\n");
}
