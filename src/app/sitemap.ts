import { routes } from "@/src/constants/routes";
import { defaultLocale, locales } from "@/src/i18n/config";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://tsuna-dev.com";

const getChangeFrequency = (
  route: string,
): MetadataRoute.Sitemap[number]["changeFrequency"] => {
  if (route === routes.root) return "weekly";
  return "monthly";
};

const buildUrl = (locale: string, route: string): string => {
  const path = route === routes.root ? "" : route;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const allRoutes = Object.values(routes);

  return locales.flatMap((locale) =>
    allRoutes.map((route) => {
      const currentUrl = buildUrl(locale, route);

      const languages: Record<string, string> = {};
      for (const loc of locales) {
        languages[loc] = buildUrl(loc, route);
      }
      languages["x-default"] = buildUrl(defaultLocale, route);

      return {
        url: currentUrl,
        lastModified: new Date(),
        changeFrequency: getChangeFrequency(route),
        priority: route === routes.root ? 1 : 0.8,
        alternates: {
          languages,
        },
      };
    }),
  );
}

export const revalidate = 3600;
