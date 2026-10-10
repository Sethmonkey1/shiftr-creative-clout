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
