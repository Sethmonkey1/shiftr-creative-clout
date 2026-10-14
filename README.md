# Creative Clout landing page study for Shiftr

A separate local Git repository that recreates [Creative Clout’s booking landing page](https://creative-clout.com/book-a-call). The active page now uses the original copy, section markup, responsive variants, and visual styling. See [the active reference implementation and verification notes](reference/FIDELITY.md) for the files to edit. The earlier simplified study is preserved as `renderStudy()`; the adaptation table below describes that earlier version.

This is a separate repository from **Shiftr Growth**. The source is available at [Sethmonkey1/shiftr-creative-clout](https://github.com/Sethmonkey1/shiftr-creative-clout).

## Run locally

Node.js 22 or later is the only runtime requirement. No dependency installation is needed.

```sh
git clone https://github.com/Sethmonkey1/shiftr-creative-clout.git
cd shiftr-creative-clout
npm run dev
```

Open **http://127.0.0.1:4178/**. Source and asset changes trigger a rebuild; refresh the browser afterward.

```powershell
npm run build     # Generate dist from source
npm run check     # Validate source, assets, links, ARIA targets, and pricing
npm run preview   # Serve the latest build
```

The `/book-a-call` route serves the same landing page. Set `$env:PORT = '4180'` before starting the server to use a different port.

## What is included

- Click-to-play video hero, animated logo strip, problem and benefit sections.
- Six animated channel cards, dark offer section, and 15 reference projects.
- Process tabs, attributed client-perspective cards, and comparison table.
- Three pricing cards with duration controls, categorized FAQs, and final CTA.
- Responsive layouts, keyboard tab navigation, reduced-motion support, native dialogs, and focus restoration.
- Local booking draft flow with clear preview status and a delete control.
- Sized WebP images, local fonts, showreel, and optimized decorative video loops. Only one visible decorative clip plays at a time; offscreen, hidden-tab, and dialog-background animation pauses. The showreel loads on demand. Project overlays retain original remote HLS streams and a local player. The original CDN returned HTTP 403 during verification, so these currently show the local poster and a link to the original collection. The local showreel plays independently.

## Adapt it for Shiftr

| File                         | Edit here                                                   |
| ---------------------------- | ----------------------------------------------------------- |
| `src/data/site.mjs`          | Brand, hero copy, theme colors, calendar URL, page metadata |
| `src/data/content.mjs`       | Problems, benefits, channels, process, and comparison       |
| `src/data/reference.mjs`     | Project media, customer logos, and people                   |
| `src/data/pricing.mjs`       | Packages, prices, duration bounds, and increments           |
| `src/data/faq.mjs`           | FAQ categories and answers                                  |
| `src/templates/sections.mjs` | Shared section markup                                       |
| `src/styles/`                | Base styles, components, sections, and responsive layouts   |
| `src/bundles.mjs`            | Stylesheet precedence                                       |
| `src/client/main.mjs`        | Tabs, dialogs, media playback, pricing, and booking         |

`bookingUrl` is deliberately empty. Set it to Shiftr’s calendar URL to make all call-to-action buttons open that destination. Until then, the form only stores a draft in browser local storage; it does not send anything or reserve a meeting. Reference pricing increments are illustrative, not Creative Clout quotations.

Before using this as a Shiftr production site, replace the reference branding, customer logos, portfolio, people, and offers with Shiftr-owned content. Replace the draft copy and remove the design-study notices and `noindex` metadata when publication is explicitly requested.

## Reference and assets

`reference/DESIGN.md` records the page structure and visual system. `reference/assets.json` records asset origins; `reference/project-streams.json` records the observed media mappings. Branding, project media, and client identities belong to Creative Clout and their respective owners, and are retained only as attributed material in this local study. Manrope and Source Serif 4 are locally hosted reference fonts. The HLS player license is included at `assets/vendor/hls.LICENSE`.

Generated output, captured original HTML, unoptimized original media, local browser evidence, and tooling packages are ignored by Git. The reference-acquisition scripts are provenance helpers for the initial import and are not part of the build. `scripts/finalize-reference.mjs` expects the original capture and the one-time FFmpeg tooling used during setup; normal development does not need either.

Display assets are committed in `assets/display` with dimensions in `src/data/display-images.mjs`. The optional `scripts/optimize-display-assets.mjs` preparation script takes a Sharp module entry path and an FFmpeg executable path. Normal builds need neither. Rebuilds preserve unchanged files to reduce disk writes and OneDrive sync activity; the preview uses conditional HTTP caching.
