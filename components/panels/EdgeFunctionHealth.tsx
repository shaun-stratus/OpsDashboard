"use client";

import useSWR from "swr";
import { Panel } from "@/components/ui/Panel";
import { StatusDot } from "@/components/ui/StatusDot";
import { fetcher } from "@/lib/fetchers";

interface FnHealth {
  name: string;
  status: "green" | "red" | "gray";
  latencyMs: number | null;
  error?: string;
}

export function EdgeFunctionHealth() {
  const { data, error } = useSWR("/api/health/edge-functions", fetcher, {
    refreshInterval: 30000,
  });

  return (
    <Panel title="Edge Functions" accent="supabase">
      {error && (
        <p className="text-xs" style={{ color: "var(--accent-error)" }}>Failed to load</p>
      )}
      {!data && !error && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
      )}
      {data?.functions?.map((fn: FnHealth) => (
        <div
          key={fn.name}
          className="flex items-center justify-between py-1.5 border-b last:border-b-0"
          style={{ borderColor: "var(--border-panel)" }}
        >
          <div className="flex items-center gap-2">
            <StatusDot status={fn.status} />
            <span className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>
              {fn.name}
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {fn.latencyMs !== null ? `${fn.latencyMs}ms` : "—"}
          </span>
        </div>
      ))}
    </Panel>
  );
}
