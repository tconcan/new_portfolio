# Tom Concannon — Portfolio

Personal portfolio site: React 19 + TypeScript, built with Vite, styled with Tailwind CSS, deployed on Cloudflare Workers.

## Development

Requires Node 20.19+ (see `.node-version`).

```bash
npm install
npm run dev        # dev server at http://localhost:3000
npm run build      # type-check, then production build to build/
npm run preview    # serve the production build at http://localhost:4173
npm test           # unit tests (Vitest)
npm run lint       # ESLint
npm run typecheck  # TypeScript only
```

## Structure

```
index.html                 HTML shell (title, meta, favicon)
src/
  main.tsx                 entry: React root + router
  App.tsx                  layout (navbar, background, footer) and routes
  index.css                Tailwind + the few custom rules
  data/                    all site content: projects, experience, involvement, links
  pages/                   HomePage, ProjectsPage
  components/
    layout/                Navbar, Footer, Background (metaball canvas), ScrollToTop
    home/                  Hero, About, involvement/, experience/
    projects/              ProjectCard, ProjectFilters, ProjectsToolbar, LazyVideo
    ui/                    shared pieces: SwipeCarousel, Disclosure, icons, style constants
  hooks/                   useMediaQuery/useIsMobile, useSwipe, useProjectQuery
  lib/                     pure logic (sorting/filtering, colors, dates) + tests
worker/                    Cloudflare Worker (video Range support) + tests
public/                    static images, videos and demo pages, served as-is
```

## Editing content

All on-page content lives in `src/data/`:

- **Projects** — `src/data/projects.ts`. `date` is the completion month (`"YYYY-MM"`) and drives the default sort. Every technology needs a color in `TECH_COLORS` and every category a style in `CATEGORY_STYLES`; a missing one is a type error, so the build fails instead of shipping a broken tag. For an animated project, set `video` to an `.mp4` and `image` to its poster frame.
- **Experience** — `src/data/experience.ts` (the first two highlights show on phones; the rest sit behind "Show more").
- **Involvement** — `src/data/involvement.ts` (`ORGANIZATION_LOGOS` for the scrolling strip, `INVOLVEMENTS` for the cards).
- **Links and contact** — `src/data/site.ts`.

`npm test` checks that every image/video the content references exists in `public/`.

## Media

Keep images small: WebP, at most ~800px wide for project cards. Convert animations to looping MP4 (H.264) plus a WebP poster frame rather than animated WebP/GIF — they're 5–20× smaller. Cloudflare rejects files over 25 MiB.

## Deployment

Pushing to `main` deploys to Cloudflare Workers (`portfolio.thomascon04.workers.dev`) using `wrangler.jsonc`:

- `build/` is served as static assets, with single-page-app fallback so routes like `/projects` survive a reload.
- `worker/index.ts` runs only for `/projects/*.mp4` and answers HTTP Range requests with `206 Partial Content`, which iOS Safari requires to play video.
