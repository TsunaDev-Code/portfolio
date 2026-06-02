import { routes } from "@/src/constants/routes";
import { createI18nMetadata } from "@/src/metadata";
import { Section } from "@/src/shared/Section/Section";
import { getTranslations, setRequestLocale } from "next-intl/server";
import classes from "./page.module.scss";

interface PrivacyProps {
  params: Promise<{ locale: string }>;
}

type PrivacyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headings: string[]; rows: string[][] };

type PrivacySection = {
  title: string;
  blocks: PrivacyBlock[];
};

export default async function Privacy({ params }: PrivacyProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Privacy");
  const sections = t.raw("sections") as PrivacySection[];

  return (
    <Section title={t("subTitle")} showLine={false} preTitle="" titleTag="h1">
      <div className={classes.body}>
        {sections.map((section, sectionIndex) => (
          <article key={section.title} className={classes.section}>
            <h2>
              {sectionIndex + 1}. {section.title}
            </h2>
            {section.blocks.map((block, index) =>
              block.type === "list" ? (
                <ol key={index} className={classes.list}>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {sectionIndex + 1}.{itemIndex + 1}. {item}
                    </li>
                  ))}
                </ol>
              ) : block.type === "table" ? (
                <div key={index} className={classes.tableWrapper}>
                  <table className={classes.table}>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p key={index} className={classes.paragraph}>
                  {block.text}
                </p>
              ),
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

export const generateMetadata = createI18nMetadata("Privacy", routes.privacy);
