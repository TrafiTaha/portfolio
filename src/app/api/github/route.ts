import { fetchActivity } from "@/lib/github";

export async function GET() {
  try {
    const data = await fetchActivity();
    return Response.json(data, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
