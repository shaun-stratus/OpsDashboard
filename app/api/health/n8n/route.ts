import { NextResponse } from "next/server";

const N8N_API_URL = process.env.N8N_API_URL!;
const N8N_API_KEY = process.env.N8N_API_KEY!;

async function n8nFetch(path: string) {
  const res = await fetch(`${N8N_API_URL}/api/v1${path}`, {
    headers: { "X-N8N-API-KEY": N8N_API_KEY },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`n8n API error: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const workflowsData = await n8nFetch("/workflows?limit=50");
    const workflows = workflowsData.data || [];

    const executionsData = await n8nFetch("/executions?limit=50");
    const executions = executionsData.data || [];

    // Build a map of workflow ID → latest execution
    const latestExecution: Record<string, { status: string; stoppedAt: string }> = {};
    for (const exec of executions) {
      const wfId = exec.workflowId;
      if (!latestExecution[wfId] || new Date(exec.stoppedAt) > new Date(latestExecution[wfId].stoppedAt)) {
        latestExecution[wfId] = { status: exec.status, stoppedAt: exec.stoppedAt };
      }
    }

    const result = workflows.map((wf: any) => {
      const lastExec = latestExecution[wf.id];
      let health: "green" | "yellow" | "red" = "yellow";

      if (!lastExec) {
        health = "yellow";
      } else if (lastExec.status === "error") {
        health = "red";
      } else {
        const hoursSince = (Date.now() - new Date(lastExec.stoppedAt).getTime()) / (1000 * 60 * 60);
        health = hoursSince > 24 ? "yellow" : "green";
      }

      return {
        id: wf.id,
        name: wf.name,
        active: wf.active,
        lastExecution: lastExec?.stoppedAt || null,
        lastStatus: lastExec?.status || null,
        health,
      };
    });

    return NextResponse.json({ workflows: result, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch n8n data", detail: String(err) },
      { status: 502 }
    );
  }
}
