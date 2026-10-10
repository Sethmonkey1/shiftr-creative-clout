import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  rename,
  stat,
} from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(
  await readFile(path.join(root, "reference/assets.json"), "utf8"),
);
const map = Object.fromEntries(
  source
    .filter((a) => a.contentType?.startsWith("image/"))
    .map((a) => [path.parse(a.file).name, `/assets/reference/${a.file}`]),
);
await writeFile(
  path.join(root, "src/data/asset-map.mjs"),
  `// Imported public reference assets, with their actual MIME extensions.\nexport const assetMap=${JSON.stringify(map, null, 2)};\n`,
);
let data = await readFile(path.join(root, "src/data/reference.mjs"), "utf8");
data = data.replace(
  "const image = name => `/assets/reference/${name}.avif`;",
  "import {assetMap} from './asset-map.mjs';\nconst image = name => assetMap[name];",
);
const streams = JSON.parse(
  await readFile(path.join(root, "reference/project-streams.json"), "utf8"),
);
data = data.replace(
  /\n  video:videoId \?[^\n]+\n/,
  `\n  video:(${JSON.stringify(
    Object.fromEntries(
      streams.map((s) => [
        new URL(s.poster).pathname
          .split("/")
          .pop()
          .replace(/\.[^.]+$/, ""),
        s.video,
      ]),
    ),
  )} )[file] || '',\n`,
);
await writeFile(path.join(root, "src/data/reference.mjs"), data);
const vendor = path.join(root, "assets/vendor");
await mkdir(vendor, { recursive: true });
for (const [url, file] of [
  ["https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js", "hls.min.js"],
  ["https://cdn.jsdelivr.net/npm/hls.js@1.6.13/LICENSE", "hls.LICENSE"],
]) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  await writeFile(
    path.join(vendor, file),
    new Uint8Array(await res.arrayBuffer()),
  );
}
const ffmpeg = path.join(
  root,
  "node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe",
);
await mkdir(path.join(root, "reference/original-media"), { recursive: true });
for (const name of [
  "clarity",
  "website",
  "social",
  "sales",
  "email",
  "ads",
  "product",
]) {
  const original = path.join(root, "reference/original-media", `${name}.mp4`);
  const dest = path.join(root, "assets/reference", `${name}.mp4`);
  await rename(dest, original);
  const code = await new Promise((resolve) => {
    const proc = spawn(
      ffmpeg,
      [
        "-y",
        "-i",
        original,
        "-t",
        "12",
        "-vf",
        "scale=640:-2,fps=24",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "26",
        "-movflags",
        "+faststart",
        dest,
      ],
      { stdio: "ignore" },
    );
    proc.on("error", () => resolve(-1));
    proc.on("exit", resolve);
  });
  if (code !== 0)
    throw new Error(
      `Could not optimize ${name}. Original preserved at ${original}`,
    );
  console.log(
    `Optimized ${name}: ${Math.round((await stat(dest)).size / 1024)} KB`,
  );
}
const manifest = await readFile(
  path.join(root, "reference/assets.json"),
  "utf8",
);
const finalAssets = JSON.parse(manifest);
finalAssets.push(
  {
    file: "showreel.mp4",
    url: "https://embed-ssl.wistia.com/deliveries/9b2550e88ba8a060328fe10c76d32c5ad8e4bce3.bin",
    contentType: "video/mp4",
  },
  {
    file: "showreel.jpg",
    url: "https://embed-ssl.wistia.com/deliveries/88bb0e87d06229e04d0bb9d99a6045aa309c822f.bin",
    contentType: "image/jpeg",
  },
  {
    file: "serif-italic.woff2",
    url: "https://fonts.gstatic.com/s/sourceserif4/v15/vEFH2_tTDB4M7-auWDN0ahZJW1ge6NmXpVAHV83Bfb_US0r6aX0.woff2",
    contentType: "font/woff2",
  },
);
await writeFile(
  path.join(root, "reference/assets.json"),
  JSON.stringify(finalAssets, null, 2) + "\n",
);
console.log("Reference assets finalized.");
