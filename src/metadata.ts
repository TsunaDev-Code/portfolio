import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale, locales } from "./i18n/config";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://tsuna-dev.com";
/**
 * Строит абсолютный URL с учётом префикса локали.
 * next-intl (as-needed): defaultLocale без префикса, остальные с /locale
 */
const buildUrl = (locale: string, path = "/"): string => {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
};

export type PageMetadataInput = {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  openGraphImage?: string;
};

/**
 * Создаёт объект Metadata с правильным canonical, hreflang, OG и Twitter тегами.
 */
export function createPageMetadata({
  locale,
  path = "/",
  title,
  description,
  keywords,
  openGraphImage,
}: PageMetadataInput): Metadata {
  const currentUrl = buildUrl(locale, path);

  // Генерация карты языковых версий для hreflang
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = buildUrl(loc, path);
  }
  languages["x-default"] = buildUrl(defaultLocale, path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: currentUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      url: currentUrl,
      siteName: "TsunaDev",
      ...(openGraphImage && { images: [openGraphImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

type GenerateMetadataArgs = {
  params: Promise<{ locale: string }>;
};

/**
 * Фабрика для генерации функции generateMetadata.
 * Автоматически: достаёт locale, устанавливает requestLocale,
 * загружает переводы и формирует мета-теги.
 */
export function createI18nMetadata(namespace: string, path: string) {
  return async function generateMetadata({
    params,
  }: GenerateMetadataArgs): Promise<Metadata> {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations(namespace);

    return createPageMetadata({
      locale,
      path,
      title: t("title"),
      description: t("description"),
      keywords: [t("keywords")].flat(),
    });
  };
}
