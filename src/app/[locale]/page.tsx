import Dots from "@/public/icons/dots.svg";
import OutlineLogo from "@/public/icons/outline_logo.svg";
import { apps, mainApps } from "@/src/constants/projects";
import { routes } from "@/src/constants/routes";
import { softSkillId, softSkillsIcon } from "@/src/constants/skills";
import { SkillsSection } from "@/src/features";
import { Link } from "@/src/i18n/navigation";
import { createI18nMetadata } from "@/src/metadata";
import { Project, Section } from "@/src/shared";
import { AboutMe, ContactButton, Contacts } from "@/src/widget";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import classes from "./page.module.scss";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations("Home");
  const tTitle = await getTranslations("Header");
  const tProjects = await getTranslations("Projects");
  const tSkills = await getTranslations("Skills");
  const skillsTitle = tSkills.raw("softSkills") as {
    id: softSkillId;
    title: string;
  }[];
  const softSkillsList = tSkills.raw("softSkillsList");
  const buttonsTitle = tProjects.raw("buttons");

  return (
    <>
      {/* Приветствие */}
      <section className={classes.mainSection}>
        <div className={classes.info}>
          <h1>
            {tHome("subTitle")} <span>{tHome("colorTitle")}</span>
          </h1>
          <p>{tHome("info")}</p>
          <ContactButton label={tHome("contactBtn")} />
        </div>
        <div className={classes.container}>
          <Image
            className={classes.bottomImg}
            src="/photo.png"
            alt={tHome("title")}
            width={500}
            height={500}
            priority
            unoptimized
          />
          <OutlineLogo className={classes.logoTmg} alt="Outline logo" />
          <Dots className={classes.dotsImg} alt="Dots picture" />
        </div>
      </section>

      {/* Проекты */}
      <Section
        title={tTitle("projects")}
        buttonsInTitle={
          <Link href="/projects" className={classes.arrowLink}>
            {tProjects("viewAll") + " ->"}
          </Link>
        }
      >
        <div className={classes.projectList}>
          {mainApps.map((item) => {
            const project = tProjects.raw(item);
            return (
              <Project
                key={item}
                title={project.title}
                stack={apps[item].stack}
                image={apps[item].image}
                description={project.description}
                buttons={apps[item].buttons}
                translator={buttonsTitle}
              />
            );
          })}
        </div>
      </Section>

      {/* Навыки */}
      <Section title={tTitle("skills")}>
        <SkillsSection
          titles={skillsTitle}
          skills={softSkillsList}
          icons={softSkillsIcon}
        />
      </Section>

      {/* Секция – обо мне */}
      <AboutMe />

      {/* Контакты */}
      <Contacts />
    </>
  );
}

export const generateMetadata = createI18nMetadata("Home", routes.root);
