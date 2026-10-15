import { fetchRepos } from "@/lib/github";

// Cached for an hour via the upstream fetch revalidation; clients fall back to static data on error.
export async function GET() {
  try {
    const repos = await fetchRepos();
    return Response.json({ repos }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
