import { contactLinks, media } from "@/src/constants/media";
import { Link } from "@/src/i18n/navigation";
import { Section } from "@/src/shared";
import { getTranslations } from "next-intl/server";
import classes from "./Contacts.module.scss";

interface ContactsProps {
  preTitle?: string;
  showLine?: boolean;
  subTitle?: string;
}

export const Contacts = async ({
  preTitle,
  subTitle,
  showLine = true,
}: ContactsProps) => {
  const tTitle = await getTranslations("Header");
  const tContacts = await getTranslations("Contacts");
  const info: string[] = tContacts.raw("info");

  return (
    <Section
      title={tTitle("contacts")}
      preTitle={preTitle}
      subTitle={subTitle}
      showLine={showLine}
    >
      <p className={classes.contactInfo}>{info}</p>
      <div className={classes.contacts}>
        <h6>{tContacts("contactTitle")}</h6>
        {contactLinks.map((item) => {
          const Icon = media[item].icon;
          if (!Icon) return null;

          return (
            <Link
              key={media[item].title}
              href={media[item].url}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              <Icon className={classes.icon} />
              {media[item].title}
            </Link>
          );
        })}
      </div>
    </Section>
  );
};
