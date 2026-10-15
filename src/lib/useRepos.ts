"use client";

import { useEffect, useState } from "react";
import { projects as curated } from "@/data/portfolio";

export type RepoLite = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  pushed_at: string;
};

export type ProjectView = {
  title: string;
  tagline: string;
  description: string | null;
  tech: string[];
  features: string[];
  github: string;
  homepage: string | null;
  language: string | null;
  stars: number | null;
  pushed: string | null;
  curated: boolean;
};

// One shared request for every consumer (classic section, room, GitHub scene).
let cache: Promise<RepoLite[] | null> | null = null;
export function loadRepos(): Promise<RepoLite[] | null> {
  cache ??= fetch("/api/repos")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((j: { repos: RepoLite[] }) => j.repos)
    .catch(() => null);
  return cache;
}

const staticViews: ProjectView[] = curated.map((p) => ({
  title: p.title,
  tagline: p.tagline,
  description: p.description,
  tech: p.tech,
  features: p.features,
  github: p.github,
  homepage: null,
  language: null,
  stars: null,
  pushed: null,
  curated: true,
}));

// Curated projects keep their rich data (matched by repo name); every other public repo shows only real GitHub metadata.
export function mergeProjects(repos: RepoLite[] | null): ProjectView[] {
  if (!repos) return staticViews;
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  const head = staticViews.map((v) => {
    const r = byName.get(v.title.toLowerCase());
    return r ? { ...v, homepage: r.homepage, language: r.language, stars: r.stargazers_count, pushed: r.pushed_at } : v;
  });
  const names = new Set(staticViews.map((v) => v.title.toLowerCase()));
  const rest = repos
    .filter((r) => !names.has(r.name.toLowerCase()))
    .map<ProjectView>((r) => ({
      title: r.name,
      tagline: r.language ?? "Repository",
      description: r.description,
      tech: [...(r.language ? [r.language] : []), ...r.topics],
      features: [],
      github: r.html_url,
      homepage: r.homepage,
      language: r.language,
      stars: r.stargazers_count,
      pushed: r.pushed_at,
      curated: false,
    }));
  return [...head, ...rest];
}

export function useProjects(): { projects: ProjectView[]; status: "loading" | "ok" | "error" } {
  const [res, setRes] = useState<{ status: "loading" | "ok" | "error"; repos: RepoLite[] | null }>({ status: "loading", repos: null });
  useEffect(() => {
    let live = true;
    loadRepos().then((repos) => {
      if (live) setRes({ status: repos ? "ok" : "error", repos });
    });
    return () => {
      live = false;
    };
  }, []);
  return { projects: mergeProjects(res.repos), status: res.status };
}

export function useRepoList(): { repos: RepoLite[] | null; status: "loading" | "ok" | "error" } {
  const [res, setRes] = useState<{ status: "loading" | "ok" | "error"; repos: RepoLite[] | null }>({ status: "loading", repos: null });
  useEffect(() => {
    let live = true;
    loadRepos().then((repos) => {
      if (live) setRes({ status: repos ? "ok" : "error", repos });
    });
    return () => {
      live = false;
    };
  }, []);
  return res;
}
