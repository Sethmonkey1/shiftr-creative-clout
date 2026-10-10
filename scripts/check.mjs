import assert from "node:assert/strict";
import { readFile, access, readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { packages, calculatePrice } from "../src/data/pricing.mjs";
import { projects, logos, media, people } from "../src/data/reference.mjs";
const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const html = await readFile(path.join(dist, "index.html"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate HTML IDs");
for (const match of html.matchAll(
  /\b(?:href|aria-controls|aria-labelledby)="([^"]+)"/g,
)) {
  const value = match[1];
  if (value.startsWith("#"))
    assert(ids.includes(value.slice(1)), `Missing anchor ${value}`);
  else if (match[0].startsWith("aria-"))
    assert(ids.includes(value), `Missing ARIA target ${value}`);
}
const local = new Set(
  [...html.matchAll(/\b(?:src|href|poster)="(\/[^"#?]+)"/g)].map((m) => m[1]),
);
const css = await readFile(path.join(dist, "styles.css"), "utf8");
for (const m of css.matchAll(/url\(['"]?(\/[^)'"?]+)['"]?\)/g)) local.add(m[1]);
for (const data of [...projects, ...logos, ...people]) {
  assert(data.image, "Missing image mapping");
  local.add(data.image);
}
for (const image of Object.values(media)) local.add(image);
local.add("/assets/reference/showreel.mp4");
local.add("/assets/vendor/hls.min.js");
for (const file of local) await access(path.join(dist, file));
for (const plan of packages) {
  assert.deepEqual(calculatePrice(plan, plan.seconds), {
    seconds: plan.seconds,
    price: plan.base,
  });
  assert.equal(
    calculatePrice(plan, plan.seconds - 30).price,
    plan.base,
    "Price must not go below the base",
  );
  assert.equal(
    calculatePrice(plan, plan.seconds + 30).price,
    plan.base + plan.increment,
  );
  assert.equal(
    calculatePrice(plan, plan.max + 30).seconds,
    plan.max,
    "Duration must stay capped",
  );
}
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else files.push(file);
  }
  return files;
}
const files = await walk(path.join(root, "src"));
for (const file of files.filter((f) => f.endsWith(".mjs"))) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
}
assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, "Expected one H1");
assert(!html.includes("undefined"), "Undefined content in HTML");
assert(
  !html.includes("fbq(") && !html.includes("gtag("),
  "Reference tracking should not be present",
);
assert.equal(
  projects.length,
  15,
  "Expected the full reference project collection",
);
console.log(
  `Checked ${local.size} local resources, ${ids.length} IDs, pricing boundaries, ${files.filter((f) => f.endsWith(".mjs")).length} source modules, and page integrity.`,
);
