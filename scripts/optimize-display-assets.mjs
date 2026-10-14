// Optional preparation tool. Normal build/preview does not need Sharp or FFmpeg.
// Pass paths to Sharp's entry point and ffmpeg.exe when regenerating these assets.
import { writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const sharp = (await import(pathToFileURL(process.argv[2]).href)).default;
const ffmpeg = process.argv[3];
const { assetMap } = await import('../src/data/asset-map.mjs');
const { projects, people, logos, media } = await import('../src/data/reference.mjs');
const directory = path.join(root, 'assets', 'display');
await mkdir(directory, { recursive: true });
const basename = source => path.parse(source).name;
const portraits = new Set([...people.map(p => basename(p.image)), basename(media.founder)]);
const brandImages = new Set(logos.map(p => basename(p.image)));
const projectImages = new Set(projects.map(p => basename(p.image)));
const variants = {};
let originalPixels = 0, displayPixels = 0;
for (const source of new Set(Object.values(assetMap))) {
  if (!source.endsWith('.avif')) continue;
  const file = path.join(root, source);
  const metadata = await sharp(file).metadata();
  const name = path.parse(source).name;
  const width = portraits.has(name) ? 96 : brandImages.has(name) ? 320 : name === basename(media.icon) ? 64 : 960;
  const output = path.join(directory, `${name}.webp`);
  const result = await sharp(file).resize({ width, withoutEnlargement: true }).webp({quality:78}).toFile(output);
  const entry = { src:`/assets/display/${name}.webp`, width:result.width, height:result.height };
  if (projectImages.has(name)) {
    const small = path.join(directory, `${name}-small.webp`);
    await sharp(file).resize({width:480,withoutEnlargement:true}).webp({quality:65}).toFile(small);
    entry.small = `/assets/display/${name}-small.webp`;
  }
  variants[source]=entry;
  originalPixels+=metadata.width*metadata.height;
  displayPixels+=result.width*result.height;
}
await sharp(path.join(root,'assets/reference/showreel.jpg')).resize({width:1200,withoutEnlargement:true}).webp({quality:80}).toFile(path.join(directory,'showreel.webp'));
for (const name of ['clarity','website','ads','social','sales','email','product']) {
  const output=path.join(directory,`${name}.jpg`);
  const code=await new Promise(resolve=>{
    const proc=spawn(ffmpeg,['-y','-ss','1','-i',path.join(root,'assets/reference',`${name}.mp4`),'-frames:v','1','-q:v','4',output],{stdio:'ignore'});
    proc.on('error',()=>resolve(-1));proc.on('exit',resolve);
  });
  if(code!==0)throw new Error(`Could not create ${name} poster`);
}
await writeFile(path.join(root,'src/data/display-images.mjs'),`// Prepared display assets; full reference originals remain available.\nexport const displayImages=${JSON.stringify(variants,null,2)};\nfor(const value of Object.values(displayImages)) displayImages[value.src]=value;\n`);
console.log(`Display image pixels: ${originalPixels.toLocaleString()} → ${displayPixels.toLocaleString()}`);
