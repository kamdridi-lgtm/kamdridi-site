import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMeta.domain;
  const routes = [
    "/",
    "/music",
    "/media",
    "/news",
    "/band",
    "/tour",
    "/store",
    "/label",
    "/label/apply",
    "/label/ai-artists",
    "/label/ai-artists/iron-county-ghosts",
    "/iron-county-ghosts",
    "/iron-county-ghosts/music",
    "/iron-county-ghosts/lyrics",
    "/iron-county-ghosts/photos",
    "/iron-county-ghosts/epk",
    "/iron-county-ghosts/contact",
    "/fan-club",
    "/games",
    "/visual-album",
    "/who-is-kam-dridi",
    "/contact"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
