// Minimal static server that mimics GitHub Pages: serves ./out under the
// configured basePath, resolves "dir/" to "dir/index.html" and falls back to 404.html.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const BASE_PATH = "/next-ecommerce-store";
const OUT_DIR = join(process.cwd(), "out");
const PORT = Number(process.env.PORT ?? 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const relative = normalize(decodeURIComponent(urlPath)).replace(/^[\\/]+/, "");
  const candidate = join(OUT_DIR, relative);
  if (!candidate.startsWith(OUT_DIR)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const index = join(candidate, "index.html");
  if (existsSync(index)) return index;
  if (existsSync(`${candidate}.html`)) return `${candidate}.html`;
  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  if (pathname === "/") {
    res.writeHead(302, { Location: `${BASE_PATH}/` }).end();
    return;
  }
  const inner = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : null;
  const file = inner === null ? null : resolveFile(inner || "/");
  const target = file ?? join(OUT_DIR, "404.html");
  res.writeHead(file ? 200 : 404, {
    "Content-Type": MIME[extname(target)] ?? "application/octet-stream",
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}${BASE_PATH}/`);
});
