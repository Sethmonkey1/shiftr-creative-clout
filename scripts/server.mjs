import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
export function serve({ port = Number(process.env.PORT || 4178) } = {}) {
  const root = path.resolve(import.meta.dirname, "../dist");
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
    ".png": "image/png",
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".mp4": "video/mp4",
    ".woff2": "font/woff2",
    ".json": "application/json",
    ".txt": "text/plain",
  };
  const server = http.createServer(async (req, res) => {
    try {
      if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405, { Allow: "GET, HEAD" });
        res.end();
        return;
      }
      const url = new URL(req.url, "http://localhost");
      let requested = decodeURIComponent(url.pathname);
      if (
        requested === "/" ||
        requested === "/book-a-call" ||
        requested === "/book-a-call/"
      )
        requested = "/index.html";
      const file = path.resolve(root, "." + requested);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const info = await stat(file);
      if (!info.isFile()) throw new Error("Not a file");
      const headers = {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
        ETag: `W/"${info.size}-${Math.trunc(info.mtimeMs)}"`,
        "Accept-Ranges": "bytes",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy":
          "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; media-src 'self' https://vz-41f371e2-ff7.b-cdn.net blob:; connect-src 'self' https://vz-41f371e2-ff7.b-cdn.net; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      };
      if (req.headers["if-none-match"] === headers.ETag) {
        res.writeHead(304, headers);
        res.end();
        return;
      }
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
      if (range) {
        const suffix = range[1] === "";
        const start = suffix
          ? Math.max(0, info.size - Number(range[2]))
          : Number(range[1]);
        const end = suffix
          ? info.size - 1
          : Math.min(
              range[2] ? Number(range[2]) : info.size - 1,
              info.size - 1,
            );
        if (start > end || start >= info.size) {
          res.writeHead(416, { "Content-Range": `bytes */${info.size}` });
          res.end();
          return;
        }
        res.writeHead(206, {
          ...headers,
          "Content-Length": end - start + 1,
          "Content-Range": `bytes ${start}-${end}/${info.size}`,
        });
        if (req.method === "HEAD") res.end();
        else createReadStream(file, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { ...headers, "Content-Length": info.size });
        if (req.method === "HEAD") res.end();
        else createReadStream(file).pipe(res);
      }
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Page not found");
    }
  });
  server.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? `Port ${port} is in use. Set PORT to another port.`
        : error,
    );
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () =>
    console.log(`Local: http://127.0.0.1:${port}/`),
  );
  return server;
}
