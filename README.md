# Backend Platform Docs

Documentation for the [Backend Platform](https://github.com/akira-shirase-oss/backend-platform):
an Astro Starlight site with the changelog inside it at `/changelog`, built for Cloudflare
Pages.

What exists and is documented: **B0** (the control-plane spine — the control API, the
reconciler worker and its operation log, the fault-injecting fake provider, and the
partial-provisioning drill) and **B1-T** (the copy-and-own starter template under
`template/`). The control plane itself is **parked**: its milestones are documented as
plans, marked as such on every page they appear on.

## Develop

```sh
npm ci
npm run dev       # local preview
npm run build     # build + security-header hashes + the output check
npm run preview   # serve the build
```

The build (`npm run build`) runs `astro build`, then `scripts/csp-hashes.mjs` (lets the
built site's own inline scripts run by SHA-256 hash, no others), then
`scripts/check-dist.mjs` (requires the pages, search index, changelog feed and security
headers; fails on a private name, path, internal decision number or third-party host).
CI runs the same and stores the built site as an artifact.

## Layout

- `src/content/docs/` — the pages (`.mdx`), mirroring the sidebar in `astro.config.mjs`
- `src/content/changelog/` — one file per change, `YYYY-MM-DD-short-name.md`; the file
  name is the entry's anchor on `/changelog`, so never rename a published entry
- `src/pages/changelog/` — the changelog page and its RSS feed
- `src/styles/theme.css` — the site's own minimal theme (provisional; the product's design
  system is a later choice, as the workspace keeps each product's look its own)
- `public/_headers` — the Cloudflare Pages security headers (the script hashes are
  written in after the build)
- `scripts/` — the build checks CI runs

## Still owed (scaffold's honest gaps)

- The snippets runner that executes every docs example against the project's `main` in CI
  (the workspace standard; the Colophon docs' `scripts/snippets.mjs` is the reference).
- The generated API reference (Scalar) once the control API emits its checked-in OpenAPI
  document — a planned control-plane milestone.
- llms.txt and Markdown copies of pages, if the project wants them.
- Cloudflare Pages project and custom domain (the maintainer creates both; `site:` in
  `astro.config.mjs` then points at the real address).
