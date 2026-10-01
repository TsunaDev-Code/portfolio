import cn from "clsx";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "../i18n/config";
import { Fira_Code } from "next/font/google";
import Link from "next/link";
import { Button } from "../shared";
import "./globals.css";
import classes from "./not-found.module.scss";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export default async function NotFound() {
  setRequestLocale(defaultLocale);
  const t = await getTranslations("NotFound");

  return (
    <div className={cn(firaCode.variable, classes.page, "antialiased")}>
      <div className={classes.title}>
        <h1>404</h1>
        <p>{t("description")}</p>
      </div>
      <Link href="/">
        <Button>{t("backHome") + " ->"}</Button>
      </Link>
    </div>
  );
}
