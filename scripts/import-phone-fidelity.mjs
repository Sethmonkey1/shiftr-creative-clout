import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL}from'node:url';
if(!process.argv[2])throw new Error('Pass the parse5 module entry path. This optional acquisition tool is not used by build or preview.');
const {parseFragment,serializeOuter}=await import(pathToFileURL(path.resolve(process.argv[2])).href);
import {assetMap}from'../src/data/asset-map.mjs';
const snapshot=parseFragment(JSON.parse(await fs.readFile('reference/phone-reference.json','utf8')).body);
const a=(n,k)=>n.attrs?.find(x=>x.name===k)?.value;
const set=(n,k,v)=>{const x=n.attrs.find(x=>x.name===k);if(x)x.value=v;else n.attrs.push({name:k,value:v});};
const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes||[]).flatMap(c=>all(c,p))];
const sourceAssets=JSON.parse(await fs.readFile('reference/assets.json','utf8'));
const extra=JSON.parse(await fs.readFile('reference/fidelity-assets.json','utf8'));
const known=new Map(sourceAssets.map(x=>[x.url.split('?')[0],'/assets/reference/'+x.file]));
async function clean(n){
 if(!n.tagName)return;
 n.attrs=n.attrs.filter(x=>!x.name.startsWith('on')&&!['srcset','sizes','autoplay','data-framer-appear-id'].includes(x.name));
 if(a(n,'style')){let s=a(n,'style');s=s.replace(/opacity:\s*0(?:\.001)?(?=;|$)/g,'opacity:1');if(/data-i/.test(n.attrs.map(x=>x.name).join()))s=s.replace(/transform:[^;]+/,'transform:none');set(n,'style',s);}
 for(const key of ['src','poster']){let u=a(n,key);if(!u?.startsWith('http'))continue;
  let id=u.split('/').at(-1).split(/[.?]/)[0],p=assetMap[id]||known.get(u.split('?')[0])||extra[u];
  if(p){p=p.replace('2c7a3481c5e68dde.mov','2c7a3481c5e68dde-display.mp4');set(n,key,p);}
  else if(n.tagName==='video')n.attrs=n.attrs.filter(x=>x.name!==key);
 }
 if(n.tagName==='video'){set(n,'preload','none');if(a(n,'src'))set(n,'data-loop','');if(a(n,'src')?.includes('-display.mp4'))set(n,'poster',a(n,'src').replace('.mp4','.jpg'));}
 if(n.tagName==='img'){set(n,'loading','lazy');set(n,'decoding','async');}
 if(n.childNodes){n.childNodes=n.childNodes.filter(c=>!['script','link','iframe'].includes(c.tagName)&&c.nodeName!=='#comment');for(const c of n.childNodes)await clean(c);}
}
const phoneVariants=all(snapshot,n=>(a(n,'class')||'').includes('ssr-variant')&&(a(n,'class')||'').includes('hidden-mzds4q')&&!(a(n,'class')||'').includes('hidden-l6uizw'));
let count=0;
for(const file of await fs.readdir('src/templates/reference')){
 const doc=parseFragment(await fs.readFile('src/templates/reference/'+file,'utf8'));
 for(const n of all(doc,n=>(a(n,'class')||'').includes('ssr-variant')&&(a(n,'class')||'').includes('hidden-mzds4q')&&!(a(n,'class')||'').includes('hidden-l6uizw'))){
  const parentClass=a(n.parentNode,'class');
  const match=phoneVariants.find(p=>a(p.parentNode,'class')===parentClass);
  if(match){const replacement=parseFragment(serializeOuter(match)).childNodes[0];await clean(replacement);n.parentNode.childNodes[n.parentNode.childNodes.indexOf(n)]=replacement;count++;}
 }
 const gallery=all(doc,n=>(a(n,'class')||'').split(' ').includes('framer-j9bna9'))[0];
 if(gallery){const original=all(snapshot,n=>(a(n,'class')||'').split(' ').includes('framer-j9bna9'))[0];if(original){const replacement=parseFragment(serializeOuter(original)).childNodes[0];await clean(replacement);gallery.parentNode.childNodes[gallery.parentNode.childNodes.indexOf(gallery)]=replacement;}}
 await fs.writeFile('src/templates/reference/'+file,doc.childNodes.map(serializeOuter).join(''));
}
console.log('Replaced '+count+' hydrated phone variants.');
