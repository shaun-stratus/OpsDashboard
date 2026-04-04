"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import useSWR from "swr";
import { Panel } from "@/components/ui/Panel";
import { TimeAgo } from "@/components/ui/TimeAgo";
import { fetcher } from "@/lib/fetchers";

export function ErrorFeed() {
  const { data, error } = useSWR("/api/health/n8n", fetcher, {
    refreshInterval: 30000,
  });

  // Filter for workflows with error status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = data?.workflows
    ?.filter((wf: any) => wf.lastStatus === "error")
    ?.map((wf: any) => ({
      source: wf.name,
      time: wf.lastExecution,
      message: `Workflow execution failed`,
    })) || [];

  return (
    <Panel title="Error Feed" accent="error">
      {error && (
        <p className="text-xs" style={{ color: "var(--accent-error)" }}>Failed to load</p>
      )}
      {errors.length === 0 && !error && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>No recent errors</p>
      )}
      <div className="max-h-48 overflow-y-auto space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {errors.map((err: any, i: number) => (
          <div
            key={i}
            className="text-xs border-l-2 pl-2 py-1"
            style={{ borderColor: "var(--accent-error)" }}
          >
            <div className="flex justify-between">
              <span className="font-medium" style={{ color: "var(--accent-error)" }}>
                {err.source}
              </span>
              {err.time && <TimeAgo date={err.time} />}
            </div>
            <p style={{ color: "var(--text-secondary)" }}>{err.message}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
