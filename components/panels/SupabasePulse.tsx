"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Panel } from "@/components/ui/Panel";
import { StatusDot } from "@/components/ui/StatusDot";
import { COLORS } from "@/lib/colors";
import { fetcher } from "@/lib/fetchers";

export function SupabasePulse() {
  const { data, error } = useSWR("/api/health/supabase", fetcher, {
    refreshInterval: 30000,
  });

  const chartData = data?.sourceTypes
    ? Object.entries(data.sourceTypes)
        .map(([name, count]) => ({ name: name.replace(/_/g, " "), count }))
        .sort((a, b) => (b.count as number) - (a.count as number))
    : [];

  return (
    <Panel title="Supabase Pulse" accent="supabase" span={2}>
      {error && (
        <p className="text-xs" style={{ color: "var(--accent-error)" }}>
          Failed to load Supabase data
        </p>
      )}
      {!data && !error && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
      )}
      {data && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Rows</p>
              <p className="font-mono text-lg font-bold" style={{ color: COLORS.supabase }}>
                {data.totalCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Lane 1</p>
              <p className="font-mono text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {data.lane1.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Lane 2</p>
              <p className="font-mono text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {data.lane2.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Null Embeddings</p>
              <p className="font-mono text-lg font-bold" style={{
                color: data.nullEmbeddings > 0 ? COLORS.error : COLORS.supabase
              }}>
                <StatusDot status={data.nullEmbeddings > 0 ? "yellow" : "green"} />{" "}
                {data.nullEmbeddings}
              </p>
            </div>
          </div>
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#12121a", border: "1px solid #1e1e2e", fontSize: 11 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="count" fill={COLORS.supabase} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </Panel>
  );
}
