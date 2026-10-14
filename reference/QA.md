# Local verification

Verified October 10, 2026.

- `npm run build` passes.
- `npm run check` passes: 52 local resources, 38 HTML IDs and ARIA references, 11 source modules, pricing limits, section anchors, and page integrity.
- Browser layouts inspected at 1440 × 1000, 768 × 1024, 390 × 844, and 320 × 780.
- A minimum-size interaction between the benefit visual and its aspect ratio was corrected. The 320px viewport now has a 305px content area and 305px document width, with no horizontal overflow.
- No broken loaded images or local video errors were observed.
- Process tabs switch content, and right-arrow keyboard navigation moves selection and focus.
- Pricing increment and decrement update duration and price. The minimum state disables decrement.
- FAQ categories switch content; accordion answers expand.
- Showreel modal opens with playable local video; closing restores focus.
- Booking preview accepts a name, email, and note, saves a local draft, and explicitly reports that nothing was sent or booked. The test draft was cleared using the provided control.
- The booking dialog remains within the phone viewport and scrolls vertically to its remaining fields.
- The original project-video CDN returns HTTP 403. The gallery’s poster fallback and original-collection link were verified; full remote project playback is unverified.
- Existing Shiftr Growth Git status was unchanged from the start of this task.

Local screenshots are saved in ignored `output/phone.jpg` and `output/desktop.jpg`.

## Performance pass

- The study hero uses a still image; the 8.95 MB showreel loads when opened.
- Display image preparation reduced the source-image pixel total from 92,490,624 to 12,521,087. Hero background tiles now use 480px images instead of originals up to 3,218px wide.
- Only one visible decorative preview plays at a time. Verified with the channel cards in view; opening the booking dialog pauses all previews. The logo strip pauses offscreen.
- Preview asset responses use ETags: verified initial HTTP 200 and conditional HTTP 304.
- An unchanged rebuild preserves the showreel file timestamp instead of copying it again.
- Build and integrity checks passed. Desktop 1440px, tablet 768px, and phone 320px layouts have no horizontal overflow. Pricing controls and the local showreel dialog still work.
- These browser checks apply to the study layout loaded during this pass. Concurrent edits introducing a separate reference renderer were preserved and are outside this verification.
