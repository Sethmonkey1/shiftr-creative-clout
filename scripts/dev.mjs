import { watch } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { serve } from "./server.mjs";
const root = path.resolve(import.meta.dirname, "..");
let building = false,
  pending = false,
  timer;
async function build() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  const code = await new Promise((resolve) =>
    spawn(process.execPath, ["scripts/build.mjs"], {
      cwd: root,
      stdio: "inherit",
    }).on("exit", resolve),
  );
  building = false;
  if (code !== 0) console.error("Build failed. Fix the source and save again.");
  else console.log("Rebuilt. Refresh the browser to see changes.");
  if (pending) {
    pending = false;
    await build();
  }
  return code;
}
if ((await build()) !== 0) process.exit(1);
const server = serve();
const watchers = ["src", "assets"].map((dir) =>
  watch(path.join(root, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 150);
  }),
);
process.on("SIGINT", () => {
  for (const watcher of watchers) watcher.close();
  server.close(() => process.exit());
});
