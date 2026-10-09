import { readFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasGameAccess, gameAccessCookie } from "@/lib/game-access";
import { sessionCookie, verifySessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

function injectMarkup(html: string, mode: "preview" | "full") {
  const badge = `
<style>
#kamdridi-access-badge {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10000;
  padding: 10px 14px;
  border: 1px solid rgba(210,177,92,.35);
  background: rgba(6,5,4,.84);
  color: #D2B15C;
  font: 10px/1.2 "Share Tech Mono", monospace;
  letter-spacing: .28em;
  text-transform: uppercase;
}
#kamdridi-preview-lock {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.88);
}
#kamdridi-preview-lock.visible {
  display: flex;
}
#kamdridi-preview-card {
  width: min(92vw, 620px);
  border: 1px solid rgba(210,177,92,.32);
  background: linear-gradient(180deg, rgba(19,14,9,.98), rgba(6,5,4,.98));
  box-shadow: 0 30px 80px rgba(0,0,0,.45);
  padding: 28px;
  text-align: center;
  color: #FFF4C2;
}
#kamdridi-preview-card h2 {
  font: 52px/0.92 "Bebas Neue", cursive;
  letter-spacing: .08em;
  color: #FFB830;
}
#kamdridi-preview-card p {
  margin-top: 16px;
  font: 11px/1.8 "Share Tech Mono", monospace;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255,244,194,.78);
}
#kamdridi-preview-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 22px;
}
#kamdridi-preview-actions a {
  padding: 14px 18px;
  border: 1px solid rgba(210,177,92,.38);
  color: #060504;
  background: #D2B15C;
  text-decoration: none;
  font: 10px/1 "Share Tech Mono", monospace;
  letter-spacing: .24em;
  text-transform: uppercase;
}
#kamdridi-preview-actions a.secondary {
  background: transparent;
  color: #D2B15C;
}
</style>
<div id="kamdridi-access-badge">${mode === "full" ? "Full Access" : "Preview Build"}</div>`;

  const previewOverlay =
    mode === "preview"
      ? `
<div id="kamdridi-preview-lock">
  <div id="kamdridi-preview-card">
    <h2>Preview Complete</h2>
    <p>Join the fan club or buy the protocol license to unlock the full corridor protocol.</p>
    <div id="kamdridi-preview-actions">
      <a href="/fan-club#membership" target="_top" rel="noreferrer">Unlock via Fan Club</a>
      <a href="/store#the-gilded-null-license" target="_top" rel="noreferrer" class="secondary">Buy the License</a>
    </div>
  </div>
</div>
<script>
window.addEventListener("load", function () {
  window.setTimeout(function () {
    var lock = document.getElementById("kamdridi-preview-lock");
    if (!lock) return;
    lock.classList.add("visible");
    document.body.style.cursor = "default";
  }, 45000);
});
</script>`
      : "";

  return html.replace("</body>", `${badge}${previewOverlay}</body>`);
}

function lockedHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Gilded Null Access Locked</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #060504;
      color: #FFF4C2;
      font-family: system-ui, sans-serif;
    }
    .card {
      width: min(92vw, 620px);
      padding: 32px;
      border: 1px solid rgba(210,177,92,.25);
      background: linear-gradient(180deg, rgba(19,14,9,.98), rgba(6,5,4,.98));
      box-shadow: 0 30px 80px rgba(0,0,0,.45);
      text-align: center;
    }
    h1 {
      margin: 0;
      font-size: clamp(32px, 6vw, 56px);
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #FFB830;
    }
    p {
      margin: 18px 0 0;
      line-height: 1.8;
      text-transform: uppercase;
      letter-spacing: .18em;
      font-size: 12px;
      color: rgba(255,244,194,.78);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Access Locked</h1>
    <p>Open the preview from the game page, join the fan club, or buy the protocol license to unlock full access.</p>
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "full" ? "full" : "preview";
  const cookieStore = await cookies();
  const fan = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
  const purchased = hasGameAccess(
    cookieStore.get(gameAccessCookie.name)?.value,
    "the-gilded-null"
  );
  const allowed = Boolean(fan) || purchased;

  if (mode === "full" && !allowed) {
    return new NextResponse(lockedHtml(), {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  const filePath = path.join(process.cwd(), "content", "games", "the-gilded-null-v12.html");
  const rawHtml = await readFile(filePath, "utf8");
  const html = injectMarkup(rawHtml, allowed ? "full" : "preview");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
