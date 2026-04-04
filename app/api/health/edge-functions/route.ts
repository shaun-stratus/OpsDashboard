import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

async function checkFunction(slug: string): Promise<{ name: string; status: "green" | "red" | "gray"; latencyMs: number | null; error?: string }> {
  const start = Date.now();
  try {
    if (slug === "search-memory") {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "health check", match_count: 1, match_threshold: 0.99 }),
      });
      const latencyMs = Date.now() - start;
      return { name: slug, status: res.ok ? "green" : "red", latencyMs, error: res.ok ? undefined : `HTTP ${res.status}` };
    }

    if (slug === "store-memory") {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: "" }),
      });
      const latencyMs = Date.now() - start;
      // 400 = function is running and validated input (expected for empty content)
      return { name: slug, status: res.status === 400 || res.ok ? "green" : "red", latencyMs };
    }

    return { name: slug, status: "gray", latencyMs: null };
  } catch (err) {
    return { name: slug, status: "red", latencyMs: null, error: String(err) };
  }
}

export async function GET() {
  const [searchMemory, storeMemory] = await Promise.all([
    checkFunction("search-memory"),
    checkFunction("store-memory"),
  ]);

  return NextResponse.json({
    functions: [searchMemory, storeMemory],
    fetchedAt: new Date().toISOString(),
  });
}
