import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMeta.domain;
  const routes = ["/", "/news", "/band", "/tour", "/media", "/store", "/fan-club", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
