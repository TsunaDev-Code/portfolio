import { media } from "@/src/constants/media";
import { routes } from "@/src/constants/routes";
import { SkillId, skills } from "@/src/constants/skills";
import { createI18nMetadata } from "@/src/metadata";
import { Section, SkillBox } from "@/src/shared";
import { AboutMe } from "@/src/widget";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Fragment } from "react";
import classes from "./page.module.scss";

interface AboutProps {
  params: Promise<{ locale: string }>;
}

export default async function About({ params }: AboutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHeader = await getTranslations("Header");
  const tAbout = await getTranslations("AboutMe");
  const tSkills = await getTranslations("Skills");
  const skillsTitle: { id: SkillId; title: string }[] = tSkills.raw("skills");
  const facts: { id: string; fact: { text: string; color?: true }[] }[] =
    tAbout.raw("facts");

  return (
    <>
      <AboutMe
        preTitle="/"
        subTitle={tAbout("subTitle")}
        showLine={false}
        showReadMore={false}
        titleTag="h1"
      />
      <Section title={tHeader("skills")} showLine={false}>
        <div className={classes.skills}>
          {skillsTitle.map((item) => (
            <SkillBox key={item.id} title={item.title} list={skills[item.id]} />
          ))}
        </div>
      </Section>
      <Section title={tAbout("my-fun-facts")} showLine={false}>
        <div className={classes.facts}>
          {facts.map((item) => {
            const Icon = item.id === "tgBlog" ? media.tgBlog?.icon : null;

            return (
              <div key={item.id} className={classes.fact}>
                {item.fact.map((fact, index) => (
                  <Fragment key={index}>
                    {fact.color ? (
                      item.id === "tgBlog" && Icon ? (
                        <div className={classes.inLine}>
                          <span className={classes.color}>{fact.text}</span>
                          <a
                            href={media.tgBlog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className={classes.icon} />
                          </a>
                        </div>
                      ) : (
                        <span className={classes.color}>{fact.text}</span>
                      )
                    ) : (
                      <span>{fact.text}</span>
                    )}
                  </Fragment>
                ))}
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

export const generateMetadata = createI18nMetadata("AboutMe", routes.about);
