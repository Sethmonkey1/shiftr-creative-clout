export const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  spark: "m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5",
  clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  refresh:
    "M20 7v5h-5M4 17v-5h5m-5 0a8 8 0 0 1 14-6l2 2m0 4a8 8 0 0 1-14 6l-2-2",
  window: "M3 8h18M6 5h.1M9 5h.1M3 3h18v18H3V3Z",
  cursor: "m4 3 7 18 2-8 8-2L4 3Z",
  message: "M21 3H3v15h5l4 3 4-3h5V3Z",
  people:
    "M16 21v-3a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v3m16 0v-3a4 4 0 0 0-3-4M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3a4 4 0 0 1 0 7",
  mail: "m3 5 9 8 9-8M3 5h18v14H3V5Z",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  play: "m8 4 13 8-13 8V4Z",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  calendar: "M7 2v5m10-5v5M3 10h18M3 5h18v17H3V5Z",
};
export const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
export const button = (label = "Let’s talk", cls = "") =>
  `<button class="button ${cls}" data-book>${esc(label)}<span class="button-arrow">${icon("arrow")}</span></button>`;
export const heading = (eyebrow, title, description = "", name = "spark") =>
  `<div class="section-heading"><span class="eyebrow">${icon(name)}${eyebrow}</span><h2>${title}</h2>${description ? `<p>${description}</p>` : ""}</div>`;
export const image = (src, alt, cls = "", extra = "") =>
  `<img src="${esc(src)}" alt="${esc(alt)}" class="${cls}" loading="lazy" decoding="async" ${extra}>`;
