import Dots from "@/public/icons/dots.svg";
import OutlineLogo from "@/public/icons/outline_logo.svg";
import { apps, mainApps } from "@/src/constants/projects";
import { routes } from "@/src/constants/routes";
import { SkillId, skills } from "@/src/constants/skills";
import { Link } from "@/src/i18n/navigation";
import { createI18nMetadata } from "@/src/metadata";
import { Project, Section, SkillBox } from "@/src/shared";
import { AboutMe, ContactButton, Contacts } from "@/src/widget";
import cn from "clsx";
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
  const skillsTitle = tSkills.raw("skills") as { id: SkillId; title: string }[];
  const buttonsTitle = tProjects.raw("buttons");

  return (
    <>
      {/* Приветствие */}
      <section className={classes.mainSection}>
        <div className={classes.info}>
          <h1>
            {tHome("subTitle")} <span>{tHome("colorTitle")}</span>
          </h1>
          <p>{tHome("description")}</p>
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
                technologies={apps[item].technologies}
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
        <div className={classes.containerGrid}>
          <Dots className={classes.boxDots1} alt="Dots picture" />
          <Dots className={classes.boxDots2} alt="Dots picture" />
          <OutlineLogo className={classes.boxLogo} alt="Outline logo icon" />
          <div className={classes.box} />
          <div className={classes.smallBox} />
        </div>
        <div className={cn(classes.skills)}>
          {skillsTitle.map((item) => (
            <SkillBox key={item.id} title={item.title} list={skills[item.id]} />
          ))}
        </div>
      </Section>

      {/* Секция – обо мне */}
      <AboutMe />

      {/* Контакты */}
      <Contacts />
    </>
  );
}

export const generateMetadata = createI18nMetadata("Home", routes.root);
