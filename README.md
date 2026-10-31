# Tom Concannon — Portfolio

Personal portfolio site built with React, React Router, and Tailwind CSS.

## Development

```bash
npm install
npm start       # dev server at http://localhost:3000
npm run build   # production build to build/
```

## Structure

- `src/App.js` — shared `Navbar` and animated `Background`, plus routes
  - `/` → `src/pages/Home.jsx` (Hero, About, Involvement, Experience, Footer)
  - `/projects` → `src/pages/Projects.jsx` (masonry grid of project cards)
- `src/components/` — page sections
- `public/<section>/` — images for each section, referenced with absolute paths (e.g. `/projects/vaclink.png`)

## Editing content

Content is stored as arrays at the top of each component:

- **Experience** — `experiences` in `src/components/Experience.jsx`
- **Involvement** — `logos` (scrolling strip) and `detailedInvolvement` (carousel) in `src/components/Involvement.jsx`
- **Projects** — `projects` in `src/pages/Projects.jsx`. Each technology tag must have a color in `techColorMap`, and each category in `categoryColorMap`. A tag with no color shows as a pulsing red ⚠ badge.

## Deployment

Deployed on Cloudflare from `main`; the build output is `build/`. Cloudflare rejects files over 25 MiB, so compress images (WebP) before adding them.
