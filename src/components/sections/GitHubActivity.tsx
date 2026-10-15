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
    <Section id="github" title="GitHub" subtitle="Live from the source: real repositories, real commits" index="05">
      {failed ? (
        <p className="font-mono text-sm text-ink-soft">
          Could not reach the GitHub API right now.{" "}
          <a href={personal.github} target="_blank" rel="noopener noreferrer" className="font-bold text-ink underline decoration-signal decoration-2 underline-offset-4">
            Visit github.com/{personal.githubUser}
          </a>{" "}
          instead.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid max-w-2xl grid-cols-3 gap-3 md:gap-5">
            {(stats.length ? stats : Array.from({ length: 3 })).map((stat, i) => {
              const s = stat as (typeof stats)[number] | undefined;
              return (
                <motion.div
                  key={s?.label ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ rotate: `${(i - 1) * 1.2}deg` }}
                  className="border-2 border-ink bg-[#fffdf8] p-3 shadow-[4px_4px_0_#111] md:p-5"
                >
                  {s ? (
                    <>
                      <s.icon size={16} className="mb-3 text-signal" aria-hidden />
                      <p className="font-display text-3xl leading-none text-ink md:text-5xl">{s.value}</p>
                      <p className="mt-2 font-mono text-[10px] font-bold tracking-widest text-ink-soft uppercase md:text-xs">
                        {s.label}
                      </p>
                    </>
                  ) : (
                    <div className="h-16 animate-pulse bg-ink/10" />
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group block border-2 border-ink bg-[#fffdf8] p-5 transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_#ff4d1c]"
                >
                  {r ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-display text-xl tracking-wide text-ink uppercase">{r.name}</p>
                        <ArrowUpRight
                          size={18}
                          className="shrink-0 text-ink transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                          aria-hidden
                        />
                      </div>
                      <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-ink-soft">
                        {r.description ?? "No description provided."}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-ink pt-3 font-mono text-[10px] font-bold tracking-wider text-ink uppercase">
                        {r.language && (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full border border-ink bg-signal" aria-hidden />
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
                    <div className="h-24 animate-pulse bg-ink/10" />
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
              className="group inline-flex w-fit items-center gap-2 border-b-2 border-ink font-mono text-sm font-bold tracking-wider text-ink uppercase transition-colors hover:border-signal hover:text-signal"
            >
              All repositories
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
        </div>
      )}
    </Section>
  );
}
