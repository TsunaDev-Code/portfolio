import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/private/"],
      },
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "Google-Extended",
          "anthropic-ai",
          "PerplexityBot",
          "YouBot",
        ],
        disallow: "/",
      },
      {
        userAgent: "YandexBot",
        crawlDelay: 1,
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
  };
}
