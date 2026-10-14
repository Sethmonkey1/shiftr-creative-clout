import { site } from "../data/site.mjs";
import { esc } from "../templates/ui.mjs";
import * as sections from "../templates/sections.mjs";
export { renderReference as render } from './reference-home.mjs';
export function renderStudy() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${esc(site.description)}"><meta name="theme-color" content="${site.accent}"><title>${esc(site.title)}</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/reference/manrope.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"></head><body style="--accent:${site.accent};--paper:${site.background}"><a class="skip-link" href="#main">Skip to content</a><main id="main">${sections.hero()}${sections.problems()}${sections.value()}${sections.useCases()}${sections.offer()}${sections.work()}${sections.process()}${sections.testimonials()}${sections.compare()}${sections.pricing()}${sections.faqs()}${sections.footer()}</main>${sections.dialogs()}<script type="module" src="/client/main.mjs"></script></body></html>`;
}
