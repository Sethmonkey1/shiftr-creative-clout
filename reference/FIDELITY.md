# Reference fidelity pass — 2026-10-10

The active build exports `renderReference()` through `src/pages/home.mjs`. Build and preview still require only Node.js, with no production dependencies. The earlier `renderStudy()` and its data/styles remain preserved.

## Active source

- `src/templates/reference/`: 42 ordered HTML partials, plus the outer shell, including original desktop and hydrated phone variants. Files are source, not generated build output.
- `src/data/reference-sections.mjs`: section ordering.
- `src/styles/reference.css`: original CSS and localized typefaces/icon fonts.
- `src/styles/reference-local.css`: local playback, booking, accessibility and responsive fixes.
- `src/pages/reference-home.mjs`: document assembly and local booking widget/dialog.
- `src/data/reference-interactions.mjs`: all four original process states and three FAQ categories.
- `src/data/reference-pricing.mjs`: verified 15-second price adjustments: Hype +$1,750; Explainer +$900; Brand Narrative +$900.
- `src/client/reference.mjs`: local controls, breakpoint selection, and visible-media playback.

No external booking is submitted. The booking form stores a request only on this device. Portfolio streams that the original CDN restricts use original local poster previews and an original-site link. The showreel is click-to-play. Background gallery clips are represented by stills; the matching layout and transforms are preserved. This is not a pixel-identical reproduction of every changing video frame or third-party widget state.

## Verification

- All 26 desktop section/header blocks matched the live reference's measured heights at 1440px: hero 310px, showreel 649px, challenges 1036px, solution 731px, use cases 1037px, offer 780px, portfolio 1344px, process 468px, testimonials 1403px, comparison 882px, pricing 662px, FAQ 576px (headers/quotes also checked).
- Verified 320px, 390px, 1024px and 1440px layouts, one visible H1 per breakpoint and no document horizontal overflow.
- Phone markup includes the actual stacked challenge/solution cards, single-column use cases, mobile gallery and comparison cards.
- Verified FAQ category switching and answer expansion; process state changes; pricing increases and decreases; booking widget dismissal and booking dialog opening/closing.
- The public copy, customer quotes, testimonial grid, comparison rows, trust metrics, pricing, and footer were restored from the reference.
- Normal build/check validates local resources including original inline CSS fonts, duplicate IDs, anchor/ARIA targets, syntax and pricing boundaries.

Additional source videos were compressed to 960px/24fps without audio (about 2.2 MB combined). Unoptimized captures are preserved under ignored `reference/original-media/`. Only one visible decorative video plays at a time; it pauses when the page is hidden or a dialog opens.

`scripts/import-fidelity.mjs` and `scripts/import-phone-fidelity.mjs` are optional provenance helpers, taking a parse5 entry path as their first argument. They require the original captures and do not run during normal development. Subsequent manual fidelity corrections are in the source partials and local stylesheet.
