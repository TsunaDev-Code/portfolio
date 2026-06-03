import { routes } from "@/src/constants/routes";
import { createI18nMetadata } from "@/src/metadata";
import { Section } from "@/src/shared/Section/Section";
import { getTranslations, setRequestLocale } from "next-intl/server";
import classes from "./page.module.scss";

interface PrivacyProps {
  params: Promise<{ locale: string }>;
}

type PrivacyTableCell = string | string[];

type PrivacyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "table"; headings?: string[]; rows: PrivacyTableCell[][] };

type PrivacySection = {
  title: string;
  blocks: PrivacyBlock[];
};

const ListBlock = ({
  block,
  sectionIndex,
  blockIndex,
}: {
  block: Extract<PrivacyBlock, { type: "list" }>;
  sectionIndex: number;
  blockIndex: number;
}) => {
  const getPrefix = (itemIndex: number) => {
    if (block.title) return "— ";
    if (block.items.length === 1)
      return `${sectionIndex + 1}.${blockIndex + 1}. `;
    return `${sectionIndex + 1}.${itemIndex + 1}. `;
  };

  return (
    <ul className={classes.list}>
      {block.title && (
        <li className={classes.listTitle}>
          {sectionIndex + 1}.{blockIndex + 1}. {block.title}
        </li>
      )}
      {block.items.map((item, itemIndex) => (
        <li key={itemIndex}>
          {getPrefix(itemIndex)}
          {item}
        </li>
      ))}
    </ul>
  );
};

const TableBlock = ({ rows }: { rows: PrivacyTableCell[][] }) => (
  <div className={classes.tableWrapper}>
    <table className={classes.table}>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>
                {Array.isArray(cell) ? (
                  <ul className={classes.cellList}>
                    {cell.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BlockRenderer = ({
  block,
  sectionIndex,
  blockIndex,
}: {
  block: PrivacyBlock;
  sectionIndex: number;
  blockIndex: number;
}) => {
  switch (block.type) {
    case "paragraph":
      return <p className={classes.paragraph}>{block.text}</p>;
    case "table":
      return <TableBlock rows={block.rows} />;
    case "list":
      return (
        <ListBlock
          block={block}
          sectionIndex={sectionIndex}
          blockIndex={blockIndex}
        />
      );
    default:
      return null;
  }
};

export default async function Privacy({ params }: PrivacyProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Privacy");
  const sections: PrivacySection[] = t.raw("sections");

  return (
    <Section title={t("subTitle")} showLine={false} preTitle="" titleTag="h1">
      <div className={classes.body}>
        {sections.map((section, sectionIndex) => (
          <article key={section.title} className={classes.section}>
            <h2>
              {sectionIndex + 1}. {section.title}
            </h2>

            {section.blocks.map((block, blockIndex) => (
              <BlockRenderer
                key={blockIndex}
                block={block}
                sectionIndex={sectionIndex}
                blockIndex={blockIndex}
              />
            ))}
          </article>
        ))}
      </div>
    </Section>
  );
}

export const generateMetadata = createI18nMetadata("Privacy", routes.privacy);
