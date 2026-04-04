import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/mcp_health?select=server_name,status,last_checked,latency_ms&order=server_name`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        next: { revalidate: 0 },
      }
    );
    const data = await res.json();
    return NextResponse.json({ servers: data, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch MCP health", detail: String(err) },
      { status: 502 }
    );
  }
}
