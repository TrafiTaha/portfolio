export const SITE_URL = "https://tahabenromdhane.vercel.app"; // update when the final domain is known

export const personal = {
  name: "Taha Ben Romdhane",
  firstName: "Taha",
  role: "Software Engineer",
  roles: ["SOFTWARE ENGINEER", "MOBILE & WEB"],
  headline: "HIGH-IMPACT MOBILE & WEB APPLICATIONS",
  summary:
    "Engineering digital tools that simplify human complexity. I design and build performant web platforms and mobile experiences end-to-end — from database schema to pixel.",
  location: "Tunis, Tunisia",
  image: "/myimage-v2.jpg",
  github: "https://github.com/TrafiTaha",
  githubUser: "TrafiTaha",
  linkedin: "https://www.linkedin.com/in/taha-ben-romdhane-765b09371",
};

export const aboutTags = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Laravel",
  "Node.js",
  "Mobile Apps",
];

export type Skill = { name: string; short: string; color: string };

// short: abbreviation label, color: brand-ish tone
export const skills: Skill[] = [
  { name: "React", short: "React", color: "#61dafb" },
  { name: "Next.js", short: "Next", color: "#ffffff" },
  { name: "TypeScript", short: "TS", color: "#3178c6" },
  { name: "JavaScript", short: "JS", color: "#f7df1e" },
  { name: "Tailwind CSS", short: "TW", color: "#38bdf8" },
  { name: "Framer Motion", short: "Motion", color: "#e64ce8" },
  { name: "Node.js", short: "Node", color: "#8cc84b" },
  { name: "Laravel", short: "Laravel", color: "#ff2d20" },
  { name: "PHP", short: "PHP", color: "#8892bf" },
  { name: "MySQL", short: "MySQL", color: "#00758f" },
  { name: "SQLite", short: "SQLite", color: "#44a2d4" },
  { name: "REST APIs", short: "REST", color: "#22c55e" },
  { name: "Git", short: "Git", color: "#f05033" },
  { name: "GitHub Actions", short: "CI/CD", color: "#a78bfa" },
  { name: "DevOps", short: "DevOps", color: "#a855f7" },
  { name: "Artificial Intelligence", short: "AI", color: "#3b82f6" },
];

export type Certificate = {
  title: string;
  issuer: string;
  duration: string;
  date: string;
  image: string;
  color: string;
};

export const certificates: Certificate[] = [
  {
    title: "DevOps",
    issuer: "9antra — The Bridge",
    duration: "2 Months",
    date: "March 2026",
    image: "/certificates/devops-9antra.png",
    color: "#a855f7",
  },
  {
    title: "AI — Recommendation System",
    issuer: "9antra — The Bridge",
    duration: "1 Month",
    date: "May 2026",
    image: "/certificates/ai-recommendation-9antra.png",
    color: "#3b82f6",
  },
];

export type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  features: string[];
  github: string;
  accent: string; // hex accent used by the generated cover art
  accent2: string;
};

export const projects: Project[] = [
  {
    title: "AlphaDocTN",
    tagline: "Enterprise Document Engine",
    description:
      "Enterprise-level document architect built around a strict permission model, so teams only see and sign what they are meant to.",
    tech: ["Laravel", "PHP", "MySQL", "RBAC"],
    features: [
      "Advanced Role-Based Access Control across departments",
      "Full document lifecycle: draft, review, approval, archive",
      "Audit trail for every sensitive operation",
    ],
    github: "https://github.com/TrafiTaha/AlphaDocTN",
    accent: "#f97316",
    accent2: "#dc2626",
  },
  {
    title: "Agrisdol",
    tagline: "Agricultural Intelligence Platform",
    description:
      "A smart-farming platform that turns field data into decisions — tracking parcels, inputs and yields for growers.",
    tech: ["Node.js", "Laravel", "SQLite"],
    features: [
      "Parcel and crop management with seasonal tracking",
      "Lightweight SQLite core for low-connectivity environments",
      "Dashboards that surface yield and input trends",
    ],
    github: "https://github.com/TrafiTaha/Agrisdol",
    accent: "#22c55e",
    accent2: "#059669",
  },
  {
    title: "WorkSphere",
    tagline: "Team Productivity Engine",
    description:
      "A team synchronization engine designed for high-performance collaboration — tasks, ownership and progress in one place.",
    tech: ["Laravel", "Blade", "MySQL"],
    features: [
      "Task boards with clear ownership and deadlines",
      "Server-rendered Blade UI for instant loads",
      "Role-aware workspaces for teams of any size",
    ],
    github: "https://github.com/TrafiTaha/WorkSphere",
    accent: "#38bdf8",
    accent2: "#2563eb",
  },
];
