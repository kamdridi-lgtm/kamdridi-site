import type { MetadataRoute } from "next";
import { siteMeta } from "@/data/site";
import { discoveryRegionRoutes, discoveryRoutes, discoveryTrackRoutes } from "@/data/discovery";

export default function sitemap(): MetadataRoute.Sitemap {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMeta.domain;
  if (baseUrl && !baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }
  baseUrl = baseUrl.replace(/\/$/, "");

  const routes = [
    "/",
    "/industry",
    "/discover",
    "/radio",
    "/sync",
    "/festival-booking",
    "/press",
    "/our-lost-dreams",
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
    "/app/war-machines-jp",
    "/label",
    "/label/ai-artists",
    "/label/ai-artists/iron-county-ghosts",
    "/iron-county-ghosts",
    "/iron-county-ghosts/music",
    "/iron-county-ghosts/lyrics",
    "/iron-county-ghosts/photos",
    "/iron-county-ghosts/epk",
    "/iron-county-ghosts/contact",
    ...discoveryRegionRoutes,
    ...discoveryTrackRoutes,
    ...discoveryRoutes
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "/" ||
      route === "/industry" ||
      route === "/discover" ||
      route === "/radio" ||
      route === "/sync" ||
      route === "/festival-booking" ||
      route.startsWith("/discover/")
        ? "weekly"
        : "monthly",
    priority:
      route === "/"
        ? 1
        : ["/industry", "/discover", "/radio", "/sync", "/festival-booking", "/press", "/our-lost-dreams"].includes(route)
          ? 0.95
          : route.startsWith("/discover/")
            ? 0.86
            : route === "/music" || route === "/band" || route === "/media"
              ? 0.9
              : 0.7
  }));
}
