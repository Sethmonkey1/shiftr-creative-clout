import { icon, button, heading, image, esc, thumbnail } from "./ui.mjs";
import { site } from "../data/site.mjs";
import { media, logos, projects, people } from "../data/reference.mjs";
import {
  challenges,
  benefits,
  channels,
  steps,
  comparison,
} from "../data/content.mjs";
import { packages } from "../data/pricing.mjs";
import { faq } from "../data/faq.mjs";

const projectButton = (p, cls = "") =>
  `<button class="project-image ${cls}" data-project="${projects.indexOf(p)}" aria-label="View ${esc(p.name)} reference project">${image(p.image, p.name)}<span class="play">${icon("play")}</span></button>`;
export function hero() {
  return `<section class="hero" id="top"><div class="hero-haze" aria-hidden="true"></div><div class="hero-mosaic" aria-hidden="true">${[...projects.slice(0, 6), ...projects.slice(0, 3)].map((p) => image(thumbnail(p.image), "")).join("")}</div><header class="header"><a class="brand" href="#top" aria-label="Creative Clout home">${image(media.icon, "", "brand-icon", 'width="36" height="36"')}<span>${site.wordmark}</span></a></header><div class="hero-content"><h1>${site.hero.first} <em>${site.hero.emphasis}</em> ${site.hero.last}<span>${site.hero.promise}</span></h1><ul class="perks">${site.hero.perks.map((p) => `<li><span>${icon("check")}</span>${p}</li>`).join("")}</ul><div class="hero-cta">${button(site.hero.cta)}<p class="micro">${site.hero.note}</p></div><div class="logo-marquee" aria-label="Brands featured in the reference"><div class="logo-track">${[...logos, ...logos].map((p, i) => image(p.image, i >= logos.length ? "" : p.name, "", i >= logos.length ? 'aria-hidden="true"' : "")).join("")}</div></div><div class="hero-reel"><button class="reel-button" data-project="0" data-showreel aria-label="Open reference showreel">${image("/assets/display/showreel.webp", "Creative Clout showreel preview", "", 'width="1200" height="675" loading="eager" fetchpriority="high"')}<span class="reel-watch"><span class="play">${icon("play")}</span>Watch the showreel</span><span class="reel-corner">CREATIVE CLOUT / SELECTED WORK</span></button></div></div></section>`;
}

export function problems() {
  return `<section class="section container" id="challenges">${heading("The challenge", "You have seconds to make<br>someone <em>see the value.</em>", "Software can do a lot. The first impression needs to make one thing clear: why it matters.", "cursor")}<div class="split split-problems"><div class="sticky-visual"><div class="visual-card clarity-visual"><video muted loop playsinline preload="none" data-loop data-src="${media.clarity}" poster="/assets/display/clarity.jpg" aria-label="Reference product animation"></video><span class="visual-caption">Less explaining. <em>More understanding.</em></span></div></div><div class="feature-list">${challenges.map(([tag, i, title, text]) => `<article class="feature"><span class="feature-tag">${icon(i)}${tag}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>`;
}

export function value() {
  return `<section class="section container" id="approach">${heading("The approach", "The right story.<br><em>Beautifully brought to life.</em>", "From a first idea to a finished film, keep every creative decision connected to the message.", "layers")}<div class="split split-benefits"><div class="feature-list">${benefits.map(([i, title, text]) => `<article class="feature"><span class="round-icon">${icon(i)}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div><div class="sticky-visual"><div class="visual-card value-visual"><div class="float-label">${icon("spark")} Made around your product</div><div class="window-art"><div class="window-bar"><i></i><i></i><i></i><span>Your product, in focus</span></div>${image(projects[1].image, "Atolio reference visual")}</div><div class="visual-chip">${icon("check")} Every detail tells the story.</div></div></div></div></section>`;
}

export function useCases() {
  return `<section class="section container" id="channels">${heading("Where it works", "One strong story.<br><em>So many places to tell it.</em>", "Meet your audience at the moments that shape their next decision.", "window")}<div class="channel-grid">${channels.map(([name, i, title, text, video]) => `<article class="channel-card"><span class="channel-label">${icon(i)}${name}</span><h3>${title}</h3><p>${text}</p><div class="channel-media"><video muted loop playsinline preload="none" data-loop data-src="/assets/reference/${video}.mp4" poster="/assets/display/${video}.jpg" aria-label="${name} reference animation"></video></div><span class="channel-check">${icon("check")} Made for the moment</span></article>`).join("")}</div></section>`;
}

export function offer() {
  return `<section class="section container" id="offer"><div class="offer-panel">${heading("The starting point", "Before the animation,<br>get the <em>message right.</em>", "A strong film starts with a clear story. Explore the narrative, find the right direction, and know what you’re making before production.", "check")}<div class="offer-grid"><article><span class="round-icon">${icon("spark")}</span><h3>Thoughtful by design.</h3><p>Start with the product, the audience, and a useful reason to care.</p></article><article><span class="round-icon">${icon("check")}</span><h3>Confidence comes first.</h3><p>A shared creative direction makes the next step feel simple.</p></article><article class="offer-action"><h3>Let’s find your story.</h3><p>A short conversation is a good place to begin.</p>${button("Book an introduction")}</article></div><p class="offer-bottom"><em>Great motion starts with something worth saying.</em> ${icon("spark")}</p></div></section><section class="quote-section container"><p>A complicated product can have<br>a wonderfully <em>simple introduction.</em></p><span>THE THINKING BEHIND THE DESIGN</span></section>`;
}

export function work() {
  return `<section class="section container" id="examples">${heading("Selected reference work", "A little less telling.<br><em>A little more showing.</em>", "A collection of Creative Clout’s public work, retained here as a visual reference.", "play")}<div class="project-grid">${projects.map((p) => `<article class="project">${projectButton(p)}<div class="project-info"><h3>${p.type} / ${p.name}</h3><span>${p.category}</span></div></article>`).join("")}</div><p class="attribution">Projects shown belong to Creative Clout and its clients. <a href="${site.referenceUrl}#examples" target="_blank" rel="noopener noreferrer">View the original collection ${icon("arrow")}</a></p></section>`;
}

export function process() {
  return `<section class="section container" id="process">${heading("The process", "From first thought<br>to <em>final frame.</em>", "Four clear stages, with room for your input at each step.", "layers")}<div class="process-shell"><div class="process-tabs" role="tablist" aria-label="Production process">${steps.map((s, i) => `<button id="step-tab-${i}" role="tab" aria-controls="step-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-step="${i}"><span>${i + 1}</span>${s.title}</button>`).join("")}</div>${steps
    .map(
      (s, i) =>
        `<div class="process-panel" role="tabpanel" id="step-panel-${i}" aria-labelledby="step-tab-${i}" ${i ? "hidden" : ""}><div class="process-copy"><span class="small-label">${s.eyebrow}</span><h3>${s.heading}</h3><p>${s.text}</p><ul class="check-list">${s.bullets.map((t) => `<li>${icon("check")}${t}</li>`).join("")}</ul></div><div class="process-visual ${s.visual}">${
          i === 0
            ? image(media.script, "Reference script and storyboard")
            : i === 1
              ? `<div class="storyboard-tiles">${projects
                  .slice(0, 4)
                  .map((p) => image(p.image, "Reference storyboard visual"))
                  .join("")}</div>`
              : i === 2
                ? `<div class="timeline-art">${image(projects[2].image, "Reference motion frame")}<div class="timeline-bars"><i></i><i></i><i></i><i></i></div><span class="timeline-cursor"></span></div>`
                : `<div class="delivery-art">${icon("check")}<strong>Ready for your next launch.</strong><span>16:9 &nbsp; · &nbsp; 9:16 &nbsp; · &nbsp; 1:1</span><div>${projects
                    .slice(0, 3)
                    .map((p) => image(p.image, "Reference delivery format"))
                    .join("")}</div></div>`
        }</div></div>`,
    )
    .join(
      "",
    )}</div><div class="center-action">${button("Start a conversation")}</div></section>`;
}

export function testimonials() {
  return `<section class="section container" id="testimonials">${heading("Client perspectives", "The story<br><em>behind the work.</em>", "A look at the kinds of outcomes discussed by clients on the original reference site.", "message")}<div class="testimonial-feature"><div class="testimonial-copy"><div class="stars" aria-label="Five stars">★★★★★</div><span class="small-label">REFERENCE CLIENT PERSPECTIVE</span><h3>Make the story useful<br>beyond the first impression.</h3><p>The original client stories connect creative work with product education, launch support, and sales conversations.</p><a href="${site.referenceUrl}#testimonials" target="_blank" rel="noopener noreferrer">Read Creative Clout’s client stories ${icon("arrow")}</a></div><button data-project="0" class="testimonial-film" aria-label="View reference work">${image(media.testimonial, "Creative Clout reference video still")}<span class="play">${icon("play")}</span></button></div><div class="testimonial-grid">${people.map((p) => `<article class="testimonial-card"><span class="client-company">${p.company}</span><p>${p.summary}</p><div class="person">${image(p.image, p.name)}<div><strong>${p.name}</strong><span>Reference client</span></div></div></article>`).join("")}</div><p class="attribution">Summaries of reference-site client perspectives; these are not Shiftr testimonials.</p></section>`;
}

export function compare() {
  return `<section class="section container" id="comparison">${heading("A closer look", "Creative choices<br><em>make the difference.</em>", "Use this framework to think about the creative partner and process your project needs.", "layers")}<div class="comparison-wrap"><table><thead><tr><th scope="col">What matters</th><th scope="col">${icon("spark")} Product-first approach</th><th scope="col">General production approach</th></tr></thead><tbody>${comparison.map(([a, b, c]) => `<tr><th scope="row">${a}</th><td>${icon("check")}<span>${b}</span></td><td>${c}</td></tr>`).join("")}</tbody></table></div></section><section class="quote-section container"><p>Your product has a story.<br><em>Let’s make it worth watching.</em></p><span>YOUR NEXT LAUNCH STARTS HERE</span></section>`;
}

export function pricing() {
  return `<section class="section container" id="pricing">${heading("Reference pricing", "A clear starting point.<br><em>Room to make it yours.</em>", "Explore the reference starting prices and a configurable duration model.", "check")}<div class="pricing-grid">${packages.map((p) => `<article class="pricing-card ${p.popular ? "popular" : ""}" data-plan="${p.id}">${p.popular ? '<span class="popular-label">The versatile choice</span>' : ""}<h3>${p.name}</h3><div class="price"><strong data-price aria-live="polite">$${p.base.toLocaleString("en-US")}</strong><span>/ video</span></div><p>${p.description}</p>${button("Talk about this project", p.popular ? "" : "button-secondary")}<ul class="check-list">${p.features.map((f) => `<li>${icon("check")}${f}</li>`).join("")}</ul><div class="duration-control"><span>EXPLORE A LONGER VIDEO</span><div><button data-duration="-30" aria-label="Shorten ${p.name}" disabled>${icon("minus")}</button><output data-duration-output>Up to ${p.seconds} seconds</output><button data-duration="30" aria-label="Lengthen ${p.name}">${icon("plus")}</button></div></div></article>`).join("")}</div><p class="attribution">Starting figures from the reference. Duration adjustments are illustrative study values, not a live quote.</p><div class="stats-strip"><div><strong>01</strong><span>A clear message</span></div><div><strong>04</strong><span>Connected creative stages</span></div><div><strong>06</strong><span>Places your story can work</span></div></div></section>`;
}

export function faqs() {
  return `<section class="section container" id="faq">${heading("A few useful answers", "Before we<br><em>get started.</em>", "The details that make the next step a little easier.", "message")}<div class="faq-shell"><div class="faq-tabs" role="tablist" aria-label="FAQ categories">${Object.keys(
    faq,
  )
    .map(
      (name, i) =>
        `<button role="tab" id="faq-tab-${i}" aria-controls="faq-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-faq-category="${i}">${name}</button>`,
    )
    .join("")}</div>${Object.entries(faq)
    .map(
      ([name, items], i) =>
        `<div role="tabpanel" id="faq-panel-${i}" aria-labelledby="faq-tab-${i}" ${i ? "hidden" : ""}>${items.map(([q, a], j) => `<details class="faq-item" ${j === 0 ? "open" : ""}><summary>${q}<span>${icon("plus")}</span></summary><div><p>${a}</p></div></details>`).join("")}</div>`,
    )
    .join("")}</div></section>`;
}

export function footer() {
  return `<section class="final-cta container" id="contact"><div><span class="small-label">SOMETHING GOOD STARTS WITH A CONVERSATION</span><h2>What are you<br><em>working on?</em></h2></div><div class="contact-card"><span class="available"><i></i>LET’S MEET</span><div class="contact-avatars">${image(media.founder, "Reference team avatar")}<span>+</span><span class="you-avatar">You</span></div><h3>A quick introduction.</h3><p>Tell us about the product and where you want to take it.</p>${button("Find a time to talk")}</div><span class="cta-doodle" aria-hidden="true">✳</span></section><footer class="footer container"><div class="footer-links"><div><h3>Explore</h3><a href="#top">The introduction</a><a href="#examples">Selected work</a><a href="#process">The process</a><a href="#pricing">Pricing</a></div><div><h3>A little more</h3><a href="#faq">Questions & answers</a><a href="#comparison">The approach</a><button data-book>Start a conversation</button></div><div><h3>The reference</h3><a href="${site.referenceUrl}" target="_blank" rel="noopener noreferrer">Creative Clout ${icon("arrow")}</a><p>An independent<br>landing page study.</p></div><div class="footer-signoff"><span class="available"><i></i>MADE TO MAKE AN IMPRESSION</span><p>Good products<br>deserve good stories.</p></div></div><a href="#top" class="footer-wordmark">${site.wordmark}</a><div class="footer-bottom"><span>${site.footerNote}</span><a href="#top">Back to the top ↑</a></div></footer><button class="floating-book" data-book aria-label="Open booking preview">${icon("calendar")}<span>Let’s talk</span>${icon("arrow")}</button>`;
}

export function dialogs() {
  return `<dialog id="project-dialog" class="modal project-modal" aria-labelledby="project-title"><div class="modal-top"><div><span class="small-label">CREATIVE CLOUT / REFERENCE WORK</span><h2 id="project-title"></h2></div><button class="close-button" data-close aria-label="Close project">${icon("close")}</button></div><div id="project-player"></div><p class="modal-note">This project belongs to Creative Clout and its client. <a id="project-source" href="${site.referenceUrl}" target="_blank" rel="noopener noreferrer">View original reference</a></p></dialog><dialog id="booking-dialog" class="modal booking-modal" aria-labelledby="booking-title"><button class="close-button" data-close aria-label="Close booking">${icon("close")}</button><span class="eyebrow">${icon("calendar")}Let’s make an introduction</span><h2 id="booking-title">Your next good<br><em>idea starts here.</em></h2><p class="booking-intro">A short conversation about your product, your audience, and what comes next.</p><div class="preview-label">Local preview · no meeting is reserved or sent</div><form id="booking-form"><fieldset><legend>1. Choose a day</legend><div class="date-options" id="date-options"></div></fieldset><fieldset><legend>2. Pick a time</legend><div class="time-options">${["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"].map((t, i) => `<label><input type="radio" name="time" value="${t}" ${i === 0 ? "checked" : ""} required><span>${t}</span></label>`).join("")}</div><p class="micro" id="timezone-label"></p></fieldset><div class="form-row"><label>Your name<input name="name" autocomplete="name" required maxlength="100" placeholder="Alex Morgan"></label><label>Work email<input name="email" type="email" autocomplete="email" required maxlength="200" placeholder="alex@company.com"></label></div><label>What are you working on?<textarea name="message" rows="3" maxlength="2000" placeholder="A little about your product or next launch…"></textarea></label><button class="button" type="submit">Save a local call request<span class="button-arrow">${icon("arrow")}</span></button><p role="status" id="booking-status" class="booking-status"></p><button id="clear-request" type="button" class="text-button" hidden>Clear saved request</button></form></dialog>`;
}
