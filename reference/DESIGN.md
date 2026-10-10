# Reference design inventory

Source: https://creative-clout.com/book-a-call

Inspected on October 10, 2026. Campaign and click-tracking query parameters were removed.

## Visual system

- Warm off-white page with bright orange emphasis and calls to action.
- Manrope sans-serif text with Source Serif 4 italic accents.
- Centered headline sections, small icon labels, and restrained body copy.
- Reference desktop headings around 56px; hero headline around 60px.
- Wide media areas, softly rounded panels, subtle borders, and pale gradients.
- Dark offer and comparison panels interrupt the light page rhythm.
- Product imagery behind the hero, horizontally moving client logos, and a full-width showreel.
- Reference mobile hero stacks the headline, two-by-two proof points, and a single CTA.

## Section order

1. Brand, hero promise, proof pills, CTA, customer logos, showreel.
2. Buyer challenges beside product media.
3. Reasons to choose the service beside product media.
4. Six distribution channels with animated examples.
5. A dark offer panel and editorial statement.
6. Fifteen public portfolio examples.
7. Script, storyboard, production, and delivery tabs.
8. Featured client perspective and smaller client cards.
9. A dark comparison table and editorial statement.
10. Three interactive pricing packages and supporting metrics area.
11. Pricing, process, and general FAQ tabs with accordions.
12. Closing booking CTA, navigation links, and oversized wordmark.

## Rebuild decisions

The local implementation preserves the visual language, reference brand and media, page progression, and key interaction types. Supporting copy is rewritten and client commentary is presented as brief attributed summaries. It does not reproduce the original tracking pixels, analytics, lead-capture endpoints, third-party chat widget, or legal pages. It is an editable design study, not an official Creative Clout site or a published Shiftr offer.

Decorative videos were optimized to muted 12-second, 640px-wide loops. Project films remain on their observed public CDN URLs and load only when opened. A local HLS fallback supports browsers without native HLS; if a source becomes unavailable, the poster and original collection link remain available. During verification the original project CDN returned HTTP 403, so the poster fallback was verified instead of full project-film playback. The separately captured local showreel plays successfully.

The initial asset capture contains some unused reference images, retained to support the later adaptation. `assets.json` provides their origins. Never reuse reference client claims as Shiftr claims.
