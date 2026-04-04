import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Total count
    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/embeddings?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "count=exact",
        },
        next: { revalidate: 0 },
      }
    );
    const totalCount = parseInt(countRes.headers.get("content-range")?.split("/")[1] || "0");

    // Source type breakdown
    const typeRes = await fetch(
      `${SUPABASE_URL}/rest/v1/embeddings?select=source_type`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        next: { revalidate: 0 },
      }
    );
    const allRows = await typeRes.json();
    const typeCounts: Record<string, number> = {};

    // Lane 2 count (no source_url)
    const lane2Res = await fetch(
      `${SUPABASE_URL}/rest/v1/embeddings?select=id&source_url=is.null&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "count=exact",
        },
        next: { revalidate: 0 },
      }
    );
    const lane2 = parseInt(lane2Res.headers.get("content-range")?.split("/")[1] || "0");
    const lane1 = totalCount - lane2;

    // Null embeddings count
    const nullRes = await fetch(
      `${SUPABASE_URL}/rest/v1/embeddings?select=id&embedding=is.null&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "count=exact",
        },
        next: { revalidate: 0 },
      }
    );
    const nullEmbeddings = parseInt(nullRes.headers.get("content-range")?.split("/")[1] || "0");

    // Count by source type
    for (const row of allRows) {
      const st = row.source_type || "unknown";
      typeCounts[st] = (typeCounts[st] || 0) + 1;
    }

    return NextResponse.json({
      totalCount,
      lane1,
      lane2,
      nullEmbeddings,
      sourceTypes: typeCounts,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch Supabase data", detail: String(err) },
      { status: 502 }
    );
  }
}
