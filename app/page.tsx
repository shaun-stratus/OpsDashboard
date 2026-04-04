import { DashboardGrid } from "@/components/DashboardGrid";
import { WorkflowStatus } from "@/components/panels/WorkflowStatus";
import { SupabasePulse } from "@/components/panels/SupabasePulse";
import { EdgeFunctionHealth } from "@/components/panels/EdgeFunctionHealth";
import { ErrorFeed } from "@/components/panels/ErrorFeed";
import { McpStatus } from "@/components/panels/McpStatus";

export default function Dashboard() {
  return (
    <main>
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Ops Dashboard
        </h1>
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          Stratus Holdings
        </span>
      </header>
      <DashboardGrid>
        <WorkflowStatus />
        <SupabasePulse />
        <EdgeFunctionHealth />
        <ErrorFeed />
        <McpStatus />
      </DashboardGrid>
    </main>
  );
}
