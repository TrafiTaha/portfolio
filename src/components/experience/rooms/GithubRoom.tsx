"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { personal } from "@/data/portfolio";
import { useRepoList } from "@/lib/useRepos";

type Activity = { user: { public_repos: number; followers: number; created_at: string }; days: { date: string; count: number }[] };

let activityCache: Promise<Activity | null> | null = null;
const loadActivity = () =>
  (activityCache ??= fetch("/api/github")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .catch(() => null));

const WEEKS = 13;
const TONES = ["#ff4d1c", "#f4f1ea", "#9a968b", "#6b675d", "#ffb199", "#c9c4b6"];

function ago(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

// Control room: a dark wall of lit panels fed by the public GitHub API (cached server-side).
export default function GithubRoom() {
  const [act, setAct] = useState<{ done: boolean; data: Activity | null }>({ done: false, data: null });
  const { repos } = useRepoList();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let live = true;
    loadActivity().then((data) => live && setAct({ done: true, data }));
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      live = false;
      window.clearInterval(t);
    };
  }, []);

  const grid = useMemo(() => {
    const byDay = new Map((act.data?.days ?? []).map((d) => [d.date, d.count]));
    const end = new Date(now);
    const cells: { date: string; count: number }[] = [];
    for (let i = WEEKS * 7 - 1; i >= 0; i--) {
      const d = new Date(end.getTime() - i * 86400000).toISOString().slice(0, 10);
      cells.push({ date: d, count: byDay.get(d) ?? 0 });
    }
    return cells;
  }, [act.data, now]);

  const total = grid.reduce((a, c) => a + c.count, 0);
  const max = Math.max(1, ...grid.map((c) => c.count));
  const stars = repos?.reduce((a, r) => a + r.stargazers_count, 0);
  const langs = useMemo(() => {
    const m = new Map<string, number>();
    repos?.forEach((r) => r.language && m.set(r.language, (m.get(r.language) ?? 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]);
  }, [repos]);
  const langTotal = langs.reduce((a, [, n]) => a + n, 0);
  const recent = [...(repos ?? [])].sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at)).slice(0, 6);
  const live = act.data !== null || repos !== null;

  const stat = (label: string, v: string | number | undefined) => (
    <div className="border-2 border-paper/60 p-3">
      <p className="font-display text-4xl leading-none text-paper sm:text-5xl">{v ?? "—"}</p>
      <p className="mt-1 font-mono text-[10px] font-bold tracking-widest text-paper/70 uppercase">{label}</p>
    </div>
  );

  return (
    <div className="relative min-h-full bg-ink px-4 pt-20 pb-16 text-paper sm:px-10" style={{ backgroundImage: "linear-gradient(rgba(244,241,234,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      <header className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.3em] text-signal uppercase">Nº 05 · Control room</p>
          <h2 className="font-display text-6xl leading-[0.9] tracking-tight uppercase sm:text-8xl">GitHub</h2>
        </div>
        <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase" aria-live="polite">
          <span aria-hidden className={`h-3 w-3 rounded-full ${live ? "animate-blink bg-signal" : "bg-paper/30"}`} />
          {act.done || repos ? (live ? "Live feed" : "Feed offline") : "Connecting…"}
          <span className="text-paper/60">{new Date(now).toISOString().slice(11, 19)} UTC</span>
        </p>
      </header>

      <div className="mx-auto mt-8 grid max-w-6xl gap-5 lg:grid-cols-12">
        {/* activity bulbs */}
        <section aria-label="Push activity" className="border-[3px] border-paper p-4 lg:col-span-7">
          <h3 className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Activity wall · last {WEEKS} weeks</h3>
          <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1.5 sm:gap-2" role="img" aria-label={`${total} public commits pushed in the last ${WEEKS} weeks`}>
            {grid.map((c) => (
              <span
                key={c.date}
                title={`${c.date}: ${c.count} commit${c.count === 1 ? "" : "s"}`}
                className={`aspect-square rounded-full border ${c.count ? "border-signal" : "border-paper/25"}`}
                style={c.count ? { background: "#ff4d1c", opacity: 0.35 + 0.65 * (c.count / max), boxShadow: "0 0 10px #ff4d1c" } : undefined}
              />
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-wider text-paper/70 uppercase">
            {act.data ? `${total} commits in GitHub's public event window` : act.done ? "Activity feed unavailable right now" : "Reading activity…"}
          </p>
        </section>

        {/* stats */}
        <section aria-label="Stats" className="grid grid-cols-2 gap-3 lg:col-span-5">
          {stat("Public repos", act.data?.user.public_repos ?? repos?.length)}
          {stat("Followers", act.data?.user.followers)}
          {stat("Total stars", stars)}
          {stat("On GitHub since", act.data ? new Date(act.data.user.created_at).getFullYear() : undefined)}
        </section>

        {/* language bar */}
        <section aria-label="Languages" className="border-[3px] border-paper p-4 lg:col-span-12">
          <h3 className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Most-used languages · by repo</h3>
          {langTotal > 0 ? (
            <>
              <div className="mt-3 flex h-8 w-full overflow-hidden border-2 border-paper">
                {langs.map(([l, n], i) => (
                  <span key={l} title={`${l}: ${n}`} style={{ width: `${(n / langTotal) * 100}%`, background: TONES[i % TONES.length] }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs font-bold uppercase">
                {langs.map(([l, n], i) => (
                  <li key={l} className="flex items-center gap-2">
                    <span aria-hidden className="h-3 w-3 border border-paper" style={{ background: TONES[i % TONES.length] }} />
                    {l} {Math.round((n / langTotal) * 100)}%
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 font-mono text-xs text-paper/70 uppercase">{repos ? "No language data yet" : "Reading repositories…"}</p>
          )}
        </section>

        {/* ticket printer */}
        <section aria-label="Recent repositories" className="lg:col-span-12">
          <h3 className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Ticket printer · recently pushed</h3>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r, i) => (
              <li key={r.name}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block border-2 border-dashed border-paper bg-paper p-4 pl-6 text-ink transition-transform hover:-translate-y-1"
                >
                  <span aria-hidden className="absolute top-0 bottom-0 left-2 border-l-2 border-dotted border-ink/50" />
                  <span className="flex items-center justify-between font-mono text-[10px] font-bold tracking-widest uppercase">
                    <span>Ticket #{String(i + 1).padStart(3, "0")}</span>
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden className="animate-blink h-2 w-2 rounded-full bg-signal" />
                      {ago(now - +new Date(r.pushed_at))}
                    </span>
                  </span>
                  <span className="mt-1 flex items-center justify-between gap-2 font-display text-2xl tracking-wide uppercase">
                    <span className="truncate">{r.name}</span>
                    <ArrowUpRight size={18} aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="block font-mono text-[11px] text-ink-soft">{r.description ?? `${r.language ?? "Repository"} · no description yet`}</span>
                </a>
              </li>
            ))}
            {recent.length === 0 && <li className="font-mono text-xs text-paper/70 uppercase">{repos === null ? "Waiting for the printer…" : "No repositories"}</li>}
          </ul>
        </section>

        <a
          href={personal.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 border-[3px] border-paper bg-signal px-6 py-3 font-display text-2xl tracking-wide text-ink uppercase shadow-[5px_5px_0_#f4f1ea] hover:-translate-y-0.5 lg:col-span-12"
        >
          Open GitHub profile <ArrowUpRight size={22} aria-hidden />
        </a>
      </div>
    </div>
  );
}
