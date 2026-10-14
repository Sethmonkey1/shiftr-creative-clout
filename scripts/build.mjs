import { mkdir, writeFile, readFile, cp, rm, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { render } from "../src/pages/home.mjs";
import { styles } from "../src/bundles.mjs";
const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
if (path.dirname(dist) !== root || path.basename(dist) !== "dist")
  throw new Error("Unexpected build directory.");
// Keep unchanged outputs intact: rebuilding should not resync every media file.
async function writeChanged(file, contents) {
  if ((await readFile(file, "utf8").catch(() => null)) !== contents)
    await writeFile(file, contents);
}
async function mirror(source, destination) {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });
  const names = new Set(entries.map((entry) => entry.name));
  for (const entry of await readdir(destination)) {
    if (names.has(entry)) continue;
    const stale = path.resolve(destination, entry);
    if (!stale.startsWith(dist + path.sep))
      throw new Error("Unexpected stale output path.");
    await rm(stale, { recursive: true, force: true });
  }
  for (const entry of entries) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) await mirror(from, to);
    else {
      const [original, copied] = await Promise.all([
        stat(from), stat(to).catch(() => null),
      ]);
      if (!copied || original.size !== copied.size ||
          original.mtimeMs > copied.mtimeMs)
        await cp(from, to);
    }
  }
}
await mkdir(dist, { recursive: true });
await writeChanged(path.join(dist, "index.html"), render());
await writeChanged(
  path.join(dist, "styles.css"),
  (
    await Promise.all(
      styles.map((f) => readFile(path.join(root, "src", "styles", f), "utf8")),
    )
  ).join("\n"),
);
for (const folder of ["assets", "src/client", "src/data"])
  await mirror(
    path.join(root, folder),
    path.join(dist, folder.replace("src/", "")),
  );
await writeChanged(
  path.join(dist, "favicon.svg"),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ff4b26"/><text x="32" y="46" font-family="Georgia" font-style="italic" font-size="50" text-anchor="middle" fill="white">c</text></svg>',
);
await writeChanged(path.join(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log("Built landing page → dist/");
