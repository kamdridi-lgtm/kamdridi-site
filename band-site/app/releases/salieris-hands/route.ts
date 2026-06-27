import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "releases", "salieris-hands", "index.html");
  const html = await readFile(filePath, "utf8");
  const body = html.includes("<base ")
    ? html
    : html.replace("<head>", '<head>\n  <base href="/releases/salieris-hands/" />');

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}