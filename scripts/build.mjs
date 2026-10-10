import { mkdir, writeFile, readFile, cp, rm } from "node:fs/promises";
import path from "node:path";
import { render } from "../src/pages/home.mjs";
import { styles } from "../src/bundles.mjs";
const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
if (path.dirname(dist) !== root || path.basename(dist) !== "dist")
  throw new Error("Unexpected build directory.");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, "index.html"), render());
await writeFile(
  path.join(dist, "styles.css"),
  (
    await Promise.all(
      styles.map((f) => readFile(path.join(root, "src", "styles", f), "utf8")),
    )
  ).join("\n"),
);
for (const folder of ["assets", "src/client", "src/data"])
  await cp(
    path.join(root, folder),
    path.join(dist, folder.replace("src/", "")),
    { recursive: true },
  );
await writeFile(
  path.join(dist, "favicon.svg"),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ff4b26"/><text x="32" y="46" font-family="Georgia" font-style="italic" font-size="50" text-anchor="middle" fill="white">c</text></svg>',
);
await writeFile(path.join(dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log("Built landing page → dist/");
