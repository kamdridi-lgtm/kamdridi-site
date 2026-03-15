import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAMDRIDI Official Website",
    short_name: "KAMDRIDI",
    description: "Official cinematic artist website for KAMDRIDI.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    icons: [
      {
        src: "/assets/images/logo.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
