import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = process.argv[2];
if (!manifestPath) throw new Error("Pass the browser asset manifest path.");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const directory = path.join(root, "assets", "reference");
await mkdir(directory, { recursive: true });
const sources = [];
for (const asset of manifest.assets) {
  if (asset.kind !== "image") continue;
  const ext =
    asset.contentType?.split("/")[1]?.replace("jpeg", "jpg") ||
    path.extname(asset.name).slice(1);
  const name = `${path.parse(asset.name).name}.${ext}`;
  if (sources.some((s) => s.file === name)) continue;
  await copyFile(asset.path, path.join(directory, name));
  sources.push({ file: name, url: asset.url, contentType: asset.contentType });
}
const downloads = [
  [
    "manrope.woff2",
    "https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2",
  ],
  [
    "clarity.mp4",
    "https://framerusercontent.com/assets/zKyM62kxHDI1dZB9YmQw7UzWyI.mp4",
  ],
  [
    "website.mp4",
    "https://framerusercontent.com/assets/wg4pUBt2A3ytPuFRuyYnAAy6VE4.mp4",
  ],
  [
    "social.mp4",
    "https://framerusercontent.com/assets/j4d2Hww73aadWfPvy48KGIENXQ.mp4",
  ],
  [
    "sales.mp4",
    "https://framerusercontent.com/assets/t2VAfLLOCz80vhpVutTsNt3Gl3Q.mp4",
  ],
  [
    "email.mp4",
    "https://framerusercontent.com/assets/sa50Qg5USo6YRBEo89feDAIETY0.mp4",
  ],
  [
    "ads.mp4",
    "https://framerusercontent.com/assets/uO1pkKOHUKeQubV2niPz6CivYY4.mp4",
  ],
  [
    "product.mp4",
    "https://framerusercontent.com/assets/Y9ayKLM2EbMXQBrTLh1ekZC9I.mp4",
  ],
];
const results = await Promise.allSettled(
  downloads.map(async ([file, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    await writeFile(
      path.join(directory, file),
      new Uint8Array(await response.arrayBuffer()),
    );
    sources.push({
      file,
      url,
      contentType: response.headers.get("content-type"),
    });
    return file;
  }),
);
await writeFile(
  path.join(root, "reference", "assets.json"),
  JSON.stringify(sources, null, 2) + "\n",
);
const html = await readFile(
  path.join(root, "reference", "source.html"),
  "utf8",
);
const inspection = {
  iframes: [...html.matchAll(/<iframe[^>]*>/g)].map((m) => m[0]),
  videoURLs: [
    ...new Set(
      [...html.matchAll(/https[^\s"<>]+\.(?:mp4|m3u8)/g)].map((m) => m[0]),
    ),
  ],
  mediaContext: [
    ...html.matchAll(/.{0,180}(?:wistia|bunny|mediadelivery).{0,280}/g),
  ]
    .slice(0, 45)
    .map((m) => m[0]),
  fontFaces: [...html.matchAll(/@font-face\s*\{[^}]+\}/g)]
    .map((m) => m[0])
    .filter((s) => /Manrope|Instrument|Serif/.test(s)),
};
await writeFile(
  path.join(root, "reference", "inspection.json"),
  JSON.stringify(inspection, null, 2),
);
console.log(`Imported ${sources.length} assets.`);
for (const result of results)
  console.log(
    result.status === "fulfilled"
      ? `Saved ${result.value}`
      : result.reason.message,
  );
console.log(
  JSON.stringify(
    {
      iframes: inspection.iframes,
      mediaContext: inspection.mediaContext.slice(0, 10),
      fontFaces: inspection.fontFaces.slice(0, 3),
    },
    null,
    2,
  ),
);
