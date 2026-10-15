import { personal } from "@/data/portfolio";

// Which repos count as "projects". Flip these if forks/archived repos should show up too.
export const INCLUDE_FORKS = false;
export const INCLUDE_ARCHIVED = false;

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  pushed_at: string;
};

export type GhUser = { public_repos: number; followers: number; created_at: string; html_url: string };
export type ActivityDay = { date: string; count: number };

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-site" };
  // Optional: raises the rate limit. Never required, never logged.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers(), next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json() as Promise<T>;
}

type RawRepo = Repo & { fork: boolean; archived: boolean };

export async function fetchRepos(): Promise<Repo[]> {
  const all: RawRepo[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await gh<RawRepo[]>(`/users/${personal.githubUser}/repos?per_page=100&sort=pushed&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all
    .filter((r) => (INCLUDE_FORKS || !r.fork) && (INCLUDE_ARCHIVED || !r.archived))
    .map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      topics: r.topics ?? [],
      stargazers_count: r.stargazers_count,
      pushed_at: r.pushed_at,
    }));
}

type RawEvent = { type: string; created_at: string; payload?: { size?: number } };

// Public push activity (GitHub's public events cover roughly the last 90 days).
export async function fetchActivity(): Promise<{ user: GhUser; days: ActivityDay[] }> {
  const user = await gh<GhUser>(`/users/${personal.githubUser}`);
  const days = new Map<string, number>();
  for (let page = 1; page <= 3; page++) {
    let batch: RawEvent[] = [];
    try {
      batch = await gh<RawEvent[]>(`/users/${personal.githubUser}/events/public?per_page=100&page=${page}`);
    } catch {
      break;
    }
    for (const e of batch) {
      if (e.type !== "PushEvent") continue;
      const d = e.created_at.slice(0, 10);
      days.set(d, (days.get(d) ?? 0) + (e.payload?.size ?? 1));
    }
    if (batch.length < 100) break;
  }
  return {
    user: { public_repos: user.public_repos, followers: user.followers, created_at: user.created_at, html_url: user.html_url },
    days: [...days].map(([date, count]) => ({ date, count })),
  };
}
