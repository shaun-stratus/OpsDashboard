"use client";

import useSWR from "swr";
import { Panel } from "@/components/ui/Panel";
import { StatusDot } from "@/components/ui/StatusDot";
import { TimeAgo } from "@/components/ui/TimeAgo";
import { fetcher } from "@/lib/fetchers";

interface McpServer {
  server_name: string;
  status: string;
  last_checked: string;
  latency_ms: number | null;
}

function statusToDot(status: string): "green" | "yellow" | "red" | "gray" {
  if (status === "healthy") return "green";
  if (status === "degraded") return "yellow";
  if (status === "down") return "red";
  return "gray";
}

export function McpStatus() {
  const { data, error } = useSWR("/api/health/mcp", fetcher, {
    refreshInterval: 30000,
  });

  return (
    <Panel title="MCP Servers" accent="neutral">
      {error && (
        <p className="text-xs" style={{ color: "var(--accent-error)" }}>Failed to load</p>
      )}
      {!data && !error && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
      )}
      {data?.servers?.map((srv: McpServer) => (
        <div
          key={srv.server_name}
          className="flex items-center justify-between py-1.5 border-b last:border-b-0"
          style={{ borderColor: "var(--border-panel)" }}
        >
          <div className="flex items-center gap-2">
            <StatusDot status={statusToDot(srv.status)} />
            <span className="text-xs" style={{ color: "var(--text-primary)" }}>
              {srv.server_name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {srv.latency_ms !== null && (
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {srv.latency_ms}ms
              </span>
            )}
            {srv.last_checked && <TimeAgo date={srv.last_checked} />}
          </div>
        </div>
      ))}
    </Panel>
  );
}
