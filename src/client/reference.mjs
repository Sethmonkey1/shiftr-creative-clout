import { referenceInteractions } from '../data/reference-interactions.mjs';
import { referencePricing } from '../data/reference-pricing.mjs';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const section=name=>$(`[data-framer-name="${name}"]`);
function breakpoint(){
 const el=$('.framer-ZlubN');
 el?.classList.remove('framer-mzds4q','framer-nb09nv','framer-l6uizw');
 el?.classList.add(innerWidth<810?'framer-l6uizw':innerWidth<1200?'framer-nb09nv':'framer-mzds4q');
}
breakpoint();addEventListener('resize',breakpoint,{passive:true});
function activate(el,action){el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('click',action);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action(e);}});}
const booking=$('#cc-booking');
const openBooking=()=>booking.showModal();
const bookingTriggers=new Set();
for(const el of $$('button,p,span,div')){
 if(el.children.length>1||el.textContent.length>40)continue;
 if(/^(Click to Book a Call|Book An Intro Call|Book Intro Call|Get Started|Book a Call)$/i.test(el.textContent.trim()))bookingTriggers.add(el.closest('a,button,[tabindex]')||el);
}
bookingTriggers.forEach(el=>activate(el,e=>{e.preventDefault();e.stopPropagation();openBooking();}));
$$('[data-local-book]').forEach(b=>b.addEventListener('click',openBooking));
$$('[data-dialog-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d&&e.clientX<d.getBoundingClientRect().left)d.close();});d.addEventListener('close',()=>$$('video',d).forEach(v=>v.pause()));});
const widget=$('#cc-widget'),toggle=$('.cc-widget-toggle');
function setWidget(open){widget.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'⌄':'⌃';}
$('[data-widget-close]').addEventListener('click',()=>setWidget(false));
toggle.addEventListener('click',()=>setWidget(widget.hidden));
const dates=Array.from({length:5},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d;});
$('.cc-days').innerHTML=dates.map((d,i)=>`<button type="button" aria-pressed="${i===0}" data-date="${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}">${d.toLocaleDateString('en-US',{weekday:'short'})}<span>${d.getDate()}</span></button>`).join('');
const dateInput=$('input[name=date]',booking);dateInput.value=$('[data-date]').dataset.date;dateInput.min=dateInput.value;
$$('[data-date]').forEach(b=>b.addEventListener('click',()=>{$$('[data-date]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));dateInput.value=b.dataset.date;}));
$('#cc-booking-form').addEventListener('submit',e=>{e.preventDefault();const request=Object.fromEntries(new FormData(e.target));try{localStorage.setItem('cc-reference-call',JSON.stringify(request));$('[role=status]',e.target).textContent='Saved on this device. No meeting has been booked or sent.';}catch{$('[role=status]',e.target).textContent='This browser could not save the request. No meeting has been booked or sent.';}});
function setupFaq(){
 const root=section('FAQ');
 for(const b of $$('button',root)){
  if(referenceInteractions.faq[b.textContent.trim()])b.addEventListener('click',()=>{root.outerHTML=referenceInteractions.faq[b.textContent.trim()];setupFaq();});
  else{
   b.setAttribute('aria-expanded','false');
   b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')==='true';$$('button[aria-expanded]',root).forEach(x=>x.setAttribute('aria-expanded','false'));b.setAttribute('aria-expanded',String(!open));});
  }
 }
 const first=$('button[aria-expanded]',root);first?.setAttribute('aria-expanded','true');
}
setupFaq();
function setupProcess(){const root=section('Process');$$('[style]',root).forEach(el=>{if(el.style.opacity==='0')el.style.opacity='1';});$$('video',root).forEach(v=>{v.dataset.loop='';v.preload='none';v.removeAttribute('autoplay');if(v.getAttribute('src')?.includes('-display.mp4'))v.poster=v.getAttribute('src').replace('.mp4','.jpg');});$$('[data-idx]',root).forEach(el=>activate(el,()=>{root.outerHTML=referenceInteractions.process[Number(el.dataset.idx)];setupProcess();observeMedia();}));}
setupProcess();
const rates=referencePricing.map(p=>p.increment),basePrices=referencePricing.map(p=>p.base),baseSeconds=referencePricing.map(p=>p.seconds);
let plan=0;
for(const duration of $$('div').filter(e=>e.children.length===0&&/^Up to \d+ seconds$/.test(e.textContent.trim()))){
 let card=duration.parentElement;
 while(card&&!/\$[\d,]+\s*\/video/.test(card.textContent))card=card.parentElement;
 if(!card)continue;
 const price=$$('div,span',card).find(e=>e.children.length===0&&/^\$[\d,]+$/.test(e.textContent.trim()));
 if(!price)continue;
 const i=basePrices.indexOf(Number(price.textContent.replace(/\D/g,'')));
 if(i<0)continue;
 let blocks=0;
 const minus=duration.previousElementSibling,plus=duration.nextElementSibling;
 const update=()=>{price.textContent='$'+(basePrices[i]+blocks*rates[i]).toLocaleString('en-US');duration.textContent=`Up to ${baseSeconds[i]+blocks*15} seconds`;minus.style.opacity=blocks?'1':'.3';minus.setAttribute('aria-disabled',String(!blocks));};
 activate(minus,()=>{blocks=Math.max(0,blocks-1);update();});minus.setAttribute('aria-label',`Shorten ${['Hype Video','Explainer Video','Brand Narrative Video'][i]}`);
 activate(plus,()=>{blocks++;update();});plus.setAttribute('aria-label',`Lengthen ${['Hype Video','Explainer Video','Brand Narrative Video'][i]}`);update();plan++;
}
// Native poster previews avoid loading blocked HLS streams on page load.
for(const video of $$('video[data-reference-video]')){
 const button=video.parentElement;
 activate(button,()=>{
  const dialog=$('#cc-project');const img=document.createElement('img');img.src=video.poster;img.alt='Creative Clout project preview';$('[data-player]',dialog).replaceChildren(img);dialog.showModal();
 });
}
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const visible=new Map();
function updateMedia(){
 let active=0;
 for(const [v,onScreen]of visible){
  if(!v.isConnected){v.pause();observer.unobserve(v);visible.delete(v);continue;}
  if(onScreen&&!document.hidden&&!motion.matches&&!$('dialog[open]')&&active<1){active++;if(v.dataset.src&&!v.src)v.src=v.dataset.src;v.muted=true;v.play().catch(()=>{});}else v.pause();
 }
}
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>visible.set(e.target,e.isIntersecting));updateMedia();},{threshold:.25});
function observeMedia(){for(const v of $$('video[data-loop]')){if(visible.has(v))continue;visible.set(v,false);observer.observe(v);}}
observeMedia();document.addEventListener('visibilitychange',updateMedia);motion.addEventListener('change',updateMedia);
new MutationObserver(updateMedia).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
// The reference uses a moving brand strip; limit motion to when it is onscreen.
const logos=section('Brand Logos');
const logoList=$('ul',logos);if(logoList){logoList.style.animation='referenceLogos 45s linear infinite';new IntersectionObserver(([e])=>{logoList.style.animationPlayState=e.isIntersecting&&!motion.matches?'running':'paused';}).observe(logos);}
