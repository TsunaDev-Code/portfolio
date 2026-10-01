"use client";

import { localeNames, locales } from "@/src/i18n/config";
import { usePathname } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import classes from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    const path = pathname === "/" ? "" : pathname.replace(/\/$/, "");

    window.location.href = `/${newLocale}${path}/`;
  };

  return (
    <select
      id="language switcher"
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className={classes.select}
    >
      {locales.map((item) => (
        <option key={item} value={item} className={classes.option}>
          {localeNames[item]}
        </option>
      ))}
    </select>
  );
};
