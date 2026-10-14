// One-time import of the inspected public reference. Not part of build/runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
if(!process.argv[2])throw new Error('Pass the parse5 module entry path. This optional acquisition tool is not used by build or preview.');
const {parse,parseFragment,serializeOuter}=await import(pathToFileURL(path.resolve(process.argv[2])).href);
import { assetMap } from '../src/data/asset-map.mjs';
const root=path.resolve(import.meta.dirname,'..');
process.chdir(root);
const live=JSON.parse(await fs.readFile('reference/live-reference.json','utf8'));
const states=JSON.parse(await fs.readFile('reference/interactive-states.json','utf8'));
const doc=parse(await fs.readFile('reference/source.html','utf8'));
const liveDoc=parseFragment(live.body);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const set=(n,k,v)=>{n.attrs??=[];const a=n.attrs.find(a=>a.name===k);if(a)a.value=v;else n.attrs.push({name:k,value:v});};
const del=(n,k)=>{n.attrs=n.attrs?.filter(a=>a.name!==k);};
const all=(n,p)=>{let a=[];if(p(n))a.push(n);for(const c of n.childNodes||[])a.push(...all(c,p));return a;};
const named=(n,name)=>all(n,e=>attr(e,'data-framer-name')===name)[0];
const replace=(a,b)=>{const p=a.parentNode;p.childNodes[p.childNodes.indexOf(a)]=b;b.parentNode=p;};
const elem=html=>parseFragment(html).childNodes[0];
const main=all(doc,e=>attr(e,'id')==='main')[0];
replace(named(main,'Background Video Gallery'),named(liveDoc,'Background Video Gallery'));
// The source contains all three responsive variants, while hydration removes them.
// Retain those variants and use the original CSS breakpoints with a tiny local switch.
const assets=JSON.parse(await fs.readFile('reference/assets.json','utf8'));
const known=new Map(assets.map(a=>[a.url.split('?')[0],'/assets/reference/'+a.file]));
const downloads=new Map();
await fs.mkdir('assets/fidelity',{recursive:true});
async function localize(url){
  if(!/^https?:/.test(url))return url;
  const clean=url.split('?')[0];
  const id=path.basename(clean).replace(/\.[^.]+$/,'');
  if(assetMap[id])return assetMap[id];
  if(known.has(clean))return known.get(clean);
  if(downloads.has(url))return downloads.get(url);
  const file='/assets/fidelity/'+createHash('sha256').update(url).digest('hex').slice(0,16)+(path.extname(clean)||'.bin');
  downloads.set(url,file);
  try { await fs.access('.'+file); } catch {
    const res=await fetch(url);if(!res.ok)throw new Error(`${res.status}: ${url}`);
    await fs.writeFile('.'+file,Buffer.from(await res.arrayBuffer()));
  }
  return file;
}
const cssURLs=new Map();
async function cssLocal(css){
  for(const m of [...css.matchAll(/url\(["']?(https?:\/\/[^\s)'";]+)["']?\)/g)]){
    if(!cssURLs.has(m[1]))cssURLs.set(m[1],await localize(m[1]));
    css=css.replaceAll(m[1],cssURLs.get(m[1]));
  }return css;
}
const videoBySection={
 'Needs Convincing':['/assets/reference/clarity.mp4'],
 'Solution':['https://framerusercontent.com/assets/lOH9DCipPruVEgGBW3n6WBnDPDs.mov'],
 'Implementation':['/assets/reference/website.mp4','/assets/reference/sales.mp4','/assets/reference/social.mp4','/assets/reference/email.mp4','/assets/reference/ads.mp4','/assets/reference/product.mp4']
};
for(const [name,urls]of Object.entries(videoBySection)){
  const videos=all(named(main,name),e=>e.tagName==='video');
  for(let i=0;i<videos.length;i++)set(videos[i],'src',urls[i%urls.length]);
}
// Match the reference gallery's real poster images without decoding dozens of streams.
let bgIndex=0;
for(const n of all(main,e=>e.tagName==='video')){
  const src=attr(n,'src')||'';
  if(src.includes('m3u8')||!src){
    const poster=attr(n,'poster');
    if(poster){set(n,'data-reference-video',src);del(n,'src');set(n,'controls','');}
    else{
      const parent=n.parentNode;
      const existing=all(parent,e=>e.tagName==='img')[0];
      if(existing){parent.childNodes=parent.childNodes.filter(e=>e!==n);continue;}
      const fallback=Object.values(assetMap).filter(v=>/avif$/.test(v));
      replace(n,elem(`<img alt="" src="${fallback[(bgIndex++ + 25)%fallback.length]}" style="width:100%;height:100%;object-fit:cover" loading="lazy">`));
    }
  }else{set(n,'data-loop','');set(n,'preload','none');del(n,'autoplay');}
}
for(const frame of all(main,e=>e.tagName==='iframe')){
 replace(frame,elem('<div class="reference-reel"><video controls playsinline preload="none" poster="/assets/reference/showreel.jpg" src="/assets/reference/showreel.mp4" aria-label="Creative Clout showreel"></video></div>'));
}
// Keep source footer SVG symbols; remove all trackers, editor scripts and embeds.
const symbols=all(doc,e=>attr(e,'id')==='svg-templates')[0];
const drops=new Set(['script','noscript','link','iframe']);
async function clean(n){
 if(n.childNodes){n.childNodes=n.childNodes.filter(c=>!drops.has(c.tagName)&&c.nodeName!=='#comment');for(const c of n.childNodes)await clean(c);}
 if(!n.tagName)return;
 n.attrs=n.attrs.filter(a=>!a.name.startsWith('on')&&!a.name.startsWith('data-framer-hydrate')&&!a.name.startsWith('data-iclosed'));
 if(attr(n,'data-framer-appear-id')!==undefined||attr(n,'data-i')!==undefined){let s=attr(n,'style')||'';s=s.replace(/opacity\s*:\s*(?:0\.001|0)(?=;|$)/g,'opacity:1').replace(/transform\s*:[^;]+/g,'transform:none');set(n,'style',s);}
 if(n.tagName==='img'){del(n,'srcset');del(n,'sizes');set(n,'decoding','async');set(n,'loading','lazy');}
 for(const key of ['src','poster']){const u=attr(n,key);if(u&&u.startsWith('http'))set(n,key,await localize(u));}
 let href=attr(n,'href');
 if(href?.startsWith('./'))set(n,'href','https://creative-clout.com/'+href.slice(2));
 if(href&&/^https:\/\/creative-clout.com\/?#(examples|process|faq)$/.test(href))set(n,'href','#'+href.split('#')[1]);
 if(href==='https://creative-clout.com/'||href==='./')set(n,'href','#top');
 for(const key of ['style'])if(attr(n,key)?.includes('url('))set(n,key,await cssLocal(attr(n,key)));
 if(n.tagName==='style')for(const t of n.childNodes||[])if(t.value)t.value=await cssLocal(t.value);
}
await clean(main);if(symbols)await clean(symbols);
// Remove repeated IDs from SSR variants; named local anchors are assigned below.
const used=new Set();for(const n of all(main,e=>!!attr(e,'id'))){let id=attr(n,'id');if(used.has(id))del(n,'id');else used.add(id);}
for(const [name,id]of [['Hero','top'],['Header: Examples','examples'],['Header: Process','process'],['Header: FAQ','faq'],['Header: Pricing','pricing']])set(named(main,name),'id',id);
let css=all(doc,e=>e.tagName==='style').map(e=>e.childNodes.map(t=>t.value||'').join('')).join('\n');
css=await cssLocal(css);
for(const type of ['thin','fill','regular']){
 const base=`https://unpkg.com/@phosphor-icons/web@2.1.1/src/${type}/`;
 let c=await(await fetch(base+'style.css')).text();
 c=c.replace(/url\(["']?\.\/([^)'"\s]+)["']?\)/g,(_,p)=>`url("${base+p}")`);
 css+='\n'+await cssLocal(c);
}
await fs.mkdir('src/templates/reference',{recursive:true});
const hero=named(main,'Hero');
const sectionFiles=[];
for(const [i,n]of [...hero.childNodes].filter(e=>e.tagName).entries()){
 const label=(attr(n,'data-framer-name')|| (i===0?'Hero Intro':`section-${i}`)).toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const file=`${String(i).padStart(2,'0')}-${label}.html`;
 sectionFiles.push(file);
 await fs.writeFile('src/templates/reference/'+file,serializeOuter(n));
}
hero.childNodes=[{nodeName:'#text',value:'__REFERENCE_SECTIONS__',parentNode:hero}];
await fs.writeFile('src/templates/reference/shell.html',serializeOuter(main)+(symbols?serializeOuter(symbols):''));
await fs.writeFile('src/data/reference-sections.mjs','export const referenceSections = '+JSON.stringify(sectionFiles,null,2)+';\n');
const interactive={faq:{},process:[]};
for(const [key,html]of Object.entries(states.faq)){const n=elem(html);await clean(n);interactive.faq[key]=serializeOuter(n);}
for(const html of states.process){const n=elem(html);await clean(n);interactive.process.push(serializeOuter(n));}
await fs.writeFile('src/data/reference-interactions.mjs','export const referenceInteractions = '+JSON.stringify(interactive,null,2)+';\n');
await fs.writeFile('src/styles/reference.css',css);
await fs.writeFile('reference/fidelity-assets.json',JSON.stringify(Object.fromEntries(downloads),null,2));
console.log(`Imported ${sectionFiles.length} original sections, ${downloads.size} additional assets and all interaction states.`);
