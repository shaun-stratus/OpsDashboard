"use client";

import useSWR from "swr";
import { Panel } from "@/components/ui/Panel";
import { StatusDot } from "@/components/ui/StatusDot";
import { TimeAgo } from "@/components/ui/TimeAgo";
import { fetcher } from "@/lib/fetchers";

interface Workflow {
  id: string;
  name: string;
  active: boolean;
  lastExecution: string | null;
  lastStatus: string | null;
  health: "green" | "yellow" | "red";
}

export function WorkflowStatus() {
  const { data, error } = useSWR("/api/health/n8n", fetcher, {
    refreshInterval: 30000,
  });

  return (
    <Panel title="Workflow Status" accent="n8n" span={2}>
      {error && (
        <p className="text-xs" style={{ color: "var(--accent-error)" }}>
          Failed to load n8n data
        </p>
      )}
      {!data && !error && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
      )}
      {data?.workflows && (
        <table className="w-full text-xs">
          <thead>
            <tr style={{ color: "var(--text-muted)" }}>
              <th className="text-left pb-2">Status</th>
              <th className="text-left pb-2">Workflow</th>
              <th className="text-left pb-2">Active</th>
              <th className="text-left pb-2">Last Run</th>
              <th className="text-left pb-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {data.workflows.map((wf: Workflow) => (
              <tr
                key={wf.id}
                className="border-t"
                style={{ borderColor: "var(--border-panel)" }}
              >
                <td className="py-1.5">
                  <StatusDot status={wf.health} />
                </td>
                <td className="py-1.5 font-medium" style={{ color: "var(--text-primary)" }}>
                  {wf.name}
                </td>
                <td className="py-1.5" style={{ color: wf.active ? "var(--accent-supabase)" : "var(--text-muted)" }}>
                  {wf.active ? "ON" : "OFF"}
                </td>
                <td className="py-1.5">
                  {wf.lastExecution ? <TimeAgo date={wf.lastExecution} /> : "—"}
                </td>
                <td className="py-1.5 font-mono" style={{
                  color: wf.lastStatus === "success" ? "var(--accent-supabase)" :
                    wf.lastStatus === "error" ? "var(--accent-error)" : "var(--text-muted)"
                }}>
                  {wf.lastStatus || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
