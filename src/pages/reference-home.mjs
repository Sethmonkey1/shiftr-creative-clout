import { readFileSync } from 'node:fs';
import { referenceSections } from '../data/reference-sections.mjs';
import { displayImages } from '../data/display-images.mjs';
import { media } from '../data/reference.mjs';
const read=(file)=>readFileSync(new URL(file,import.meta.url),'utf8');
export function renderReference(){
 let body=read('../templates/reference/shell.html').replace('__REFERENCE_SECTIONS__',referenceSections.map(f=>read('../templates/reference/'+f)).join('\n'));
 // Reuse the optimized media prepared in the main thread.
 for(const [original,image] of Object.entries(displayImages))body=body.replaceAll(original,image.src);
 body=body.replaceAll('opacity:0;', 'opacity:1;');
 const ids=new Set();body=body.replace(/\sid="([^"]+)"/g,(match,id)=>{if(ids.has(id))return '';ids.add(id);return match;});
 body=body.replace(/(<video[^>]*src="(\/assets\/fidelity\/[^\"]+-display)\.mp4")/g,'$1 poster="$2.jpg"');
 body=body.replace(/<video\b[^>]*>/g,tag=>{
  if(tag.includes('poster='))return tag;
  const name=tag.match(/src="\/assets\/reference\/(clarity|website|ads|social|sales|email|product)\.mp4"/)?.[1];
  return name?tag.slice(0,-1)+` poster="/assets/display/${name}.jpg">`:tag;
 });
 const css=read('../styles/reference.css')+'\n'+read('../styles/reference-local.css');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Creative Clout — Reference replica for Shiftr</title><link rel="icon" href="/favicon.svg"><style>${css}</style></head><body>${body}
 <aside class="cc-widget" aria-label="Schedule a call" id="cc-widget"><header><img src="/assets/fidelity/matt-avatar.jpg" alt="Matt R."><strong>Matt R.</strong><button data-widget-close aria-label="Close scheduling widget">×</button></header><div class="cc-widget-copy"><strong>Need a video for your product?</strong><p>Script, Motion &amp; Sound Design 100% DFY</p><p>Book a call and we'll map out the right video for your product.</p></div><div class="cc-days" aria-label="Choose a day"></div><button class="cc-schedule" data-local-book>Schedule a Call <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M7 2v6m10-6v6"/></svg></button><footer>Powered by <strong>◢ iClosed</strong></footer></aside><button class="cc-widget-toggle" aria-controls="cc-widget" aria-expanded="true" aria-label="Toggle scheduling widget">⌄</button>
 <dialog class="cc-dialog" id="cc-booking"><button class="cc-close" data-dialog-close aria-label="Close booking">×</button><h2>Book a Call</h2><p>Quick 15-minute call</p><p class="cc-preview-note">Local preview · no meeting is reserved or sent.</p><form id="cc-booking-form"><label>Your name<input name="name" autocomplete="name" required></label><label>Work email<input name="email" type="email" autocomplete="email" required></label><label>Preferred date<input name="date" type="date" required></label><button class="cc-schedule" type="submit">Save local request</button><p role="status"></p></form></dialog><dialog class="cc-dialog cc-player" id="cc-project"><button class="cc-close" data-dialog-close aria-label="Close video">×</button><div data-player></div><p>Creative Clout reference project. <a href="https://creative-clout.com/book-a-call#examples" target="_blank" rel="noopener">View on the original site</a></p></dialog>
 <script type="module" src="/client/reference.mjs"></script></body></html>`;
}
