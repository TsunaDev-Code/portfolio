import { allMediaLinks } from "@/src/constants/media";
import { routes } from "@/src/constants/routes";
import { createI18nMetadata } from "@/src/metadata";
import { Media, Section } from "@/src/shared";
import { Contacts } from "@/src/widget";
import { getTranslations, setRequestLocale } from "next-intl/server";
import classes from "./page.module.scss";

interface ContactsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tContacts = await getTranslations("Contacts");

  return (
    <>
      <Contacts
        preTitle="/"
        subTitle={tContacts("subTitle")}
        showLine={false}
        titleTag="h1"
      />
      <Section title={tContacts("allMedia")} showLine={false}>
        <div className={classes.allMedia}>
          <Media links={allMediaLinks} showText={true} />
        </div>
      </Section>
    </>
  );
}

export const generateMetadata = createI18nMetadata("Contacts", routes.contacts);
