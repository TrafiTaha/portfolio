"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookMarked, GitFork, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import Section from "@/components/ui/Section";
import { personal } from "@/data/portfolio";

type GitHubUser = {
  public_repos: number;
  followers: number;
  created_at: string;
};

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
};

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  PHP: "#8892bf",
  Blade: "#ff2d20",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00b4ab",
  Python: "#3572a5",
  Kotlin: "#a97bff",
  Java: "#b07219",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function GitHubActivity() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`https://api.github.com/users/${personal.githubUser}`, { signal: controller.signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(String(r.status)))
      ),
      fetch(`https://api.github.com/users/${personal.githubUser}/repos?sort=pushed&per_page=6`, {
        signal: controller.signal,
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))),
    ])
      .then(([u, r]: [GitHubUser, Repo[]]) => {
        setUser(u);
        setRepos(r.filter((repo) => !repo.fork).slice(0, 4));
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const stats = user
    ? [
        { label: "Public repos", value: user.public_repos, icon: BookMarked },
        { label: "Followers", value: user.followers, icon: Users },
        { label: "On GitHub since", value: new Date(user.created_at).getFullYear(), icon: Star },
      ]
    : [];

  return (
    <Section id="github" title="GitHub" subtitle="Live from the source — real repositories, real commits" index="05">
      {failed ? (
        <p className="text-sm text-zinc-500 font-mono">
          Could not reach the GitHub API right now —{" "}
          <a href={personal.github} target="_blank" rel="noopener noreferrer" className="text-cyber-lime hover:underline">
            visit github.com/{personal.githubUser}
          </a>{" "}
          instead.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl">
            {(stats.length ? stats : Array.from({ length: 3 })).map((stat, i) => {
              const s = stat as (typeof stats)[number] | undefined;
              return (
                <motion.div
                  key={s?.label ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 md:p-5"
                >
                  {s ? (
                    <>
                      <s.icon size={16} className="text-cyber-lime mb-3" aria-hidden />
                      <p className="text-2xl md:text-3xl font-black text-zinc-100 leading-none">{s.value}</p>
                      <p className="text-[10px] md:text-xs font-mono tracking-widest text-zinc-500 uppercase mt-2">
                        {s.label}
                      </p>
                    </>
                  ) : (
                    <div className="h-16 animate-pulse rounded bg-white/5" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Latest repos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {(repos.length ? repos : Array.from({ length: 4 })).map((repo, i) => {
              const r = repo as Repo | undefined;
              return (
                <motion.a
                  key={r?.id ?? i}
                  href={r?.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group rounded-xl border border-white/5 bg-zinc-900/40 p-5 hover:border-cyber-lime/30 hover:bg-zinc-900/70 transition-colors"
                >
                  {r ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-zinc-100 group-hover:text-cyber-lime transition-colors truncate">
                          {r.name}
                        </p>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-zinc-600 group-hover:text-cyber-lime group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                          aria-hidden
                        />
                      </div>
                      <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2 min-h-8">
                        {r.description ?? "No description provided."}
                      </p>
                      <div className="flex items-center gap-4 mt-4 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                        {r.language && (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: languageColors[r.language] ?? "#71717a" }}
                              aria-hidden
                            />
                            {r.language}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} aria-hidden /> {r.stargazers_count}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GitFork size={11} aria-hidden /> {r.forks_count}
                        </span>
                        <span className="ml-auto normal-case">{timeAgo(r.pushed_at)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-24 animate-pulse rounded bg-white/5" />
                  )}
                </motion.a>
              );
            })}
          </div>

          <Magnetic strength={0.3} className="w-fit">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-cyber-lime transition-colors w-fit"
            >
              All repositories
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Magnetic>
        </div>
      )}
    </Section>
  );
}
