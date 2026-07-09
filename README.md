# Taha Ben Romdhane — Portfolio

Personal portfolio of **Taha Ben Romdhane**, Software Engineer (Tunis, Tunisia). An editorial, dark, scroll-based single page with kinetic typography, an interactive 3D skills ball-pit, and live GitHub data.

**Live GitHub:** [github.com/TrafiTaha](https://github.com/TrafiTaha) · **LinkedIn:** [taha-ben-romdhane](https://www.linkedin.com/in/taha-ben-romdhane-765b09371)

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) — kinetic headings, reveals, tilt cards
- [React Three Fiber](https://r3f.docs.pmnd.rs) + Three.js — physics-driven skills ball-pit
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling

## Structure

```
src/
  app/            layout (SEO / OG / JSON-LD), page, global styles
  data/           portfolio.ts — single source of truth for all content
  components/
    layout/       Navbar
    sections/     Hero, About, Skills, Projects, GitHubActivity, Contact
    ui/           Section (animated heading), ScrambleText, TiltCard
legacy/           archived pre-redesign components (excluded from build)
```

All personal content (projects, skills, links) lives in [`src/data/portfolio.ts`](src/data/portfolio.ts) — edit that file to update the site. Update `SITE_URL` there when the production domain changes.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
npm run lint
```

The GitHub section calls the public GitHub API client-side (no token) and degrades gracefully if rate-limited.
