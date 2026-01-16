import type { MetadataRoute } from "next";
import { lessons } from "@/lib/lessons";

const baseUrl = "https://adidab.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tools",
    "/whales",
    "/learn",
    "/learn/whitepaper",
    "/community",
  ];

  const lessonRoutes = lessons.map((lesson) => `/learn/${lesson.slug}`);

  return [...staticRoutes, ...lessonRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
