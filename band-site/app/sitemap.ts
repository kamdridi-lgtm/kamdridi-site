import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMeta.domain;
  if (baseUrl && !baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }
  baseUrl = baseUrl.replace(/\/$/, "");

  const routes = [
    "/",
    "/music",
    "/media",
    "/news",
    "/band",
    "/tour",
    "/store",
    "/contact",
    "/fan-club",
    "/games",
    "/visual-album",
    "/who-is-kam-dridi",
    "/australia",
    "/label",
    "/label/apply",
    "/label/ai-artists",
    "/label/ai-artists/iron-county-ghosts",
    "/iron-county-ghosts",
    "/iron-county-ghosts/music",
    "/iron-county-ghosts/lyrics",
    "/iron-county-ghosts/photos",
    "/iron-county-ghosts/epk",
    "/iron-county-ghosts/contact"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority:
      route === "/"
        ? 1
        : route === "/music" || route === "/band" || route === "/media"
          ? 0.9
          : 0.7
  }));
}
