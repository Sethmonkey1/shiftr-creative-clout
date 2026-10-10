import { readFile, writeFile } from "node:fs/promises";
const html = await readFile(
  new URL("../reference/source.html", import.meta.url),
  "utf8",
);
const entries = [];
for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (!m[2].includes("bf0212e3")) continue;
  try {
    const data = JSON.parse(m[2]);
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] === "string" && data[i].endsWith("playlist.m3u8")) {
        const nearby = data
          .slice(i, i + 35)
          .filter((v) => typeof v === "string");
        const poster = nearby.find((v) =>
          v.includes("framerusercontent.com/images/"),
        );
        if (poster) entries.push({ video: data[i], poster });
      }
    }
  } catch (e) {
    console.log(m[1], m[2].slice(0, 100), e.message);
  }
}
await writeFile(
  new URL("../reference/project-streams.json", import.meta.url),
  JSON.stringify(entries, null, 2) + "\n",
);
console.log(JSON.stringify(entries, null, 2));
