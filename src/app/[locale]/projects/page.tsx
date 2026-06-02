import {
  apps,
  AppsKey,
  completeApps,
  smallApps,
} from "@/src/constants/projects";
import { routes } from "@/src/constants/routes";
import { createI18nMetadata } from "@/src/metadata";
import { Project, Section, Title } from "@/src/shared";
import { getTranslations, setRequestLocale } from "next-intl/server";
import classes from "./page.module.scss";

interface ProjectsProps {
  params: Promise<{ locale: string }>;
}

export default async function Projects({ params }: ProjectsProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHeader = await getTranslations("Header");
  const tProjects = await getTranslations("Projects");
  const buttonsTitle = tProjects.raw("buttons");

  const projectsGrid = ({
    title,
    listApps,
  }: {
    title: string;
    listApps: AppsKey[];
  }) => (
    <>
      <Title title={title} />
      <div className={classes.list}>
        {listApps.map((item) => {
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
    </>
  );

  return (
    <Section
      title={tHeader("projects")}
      titleTag="h1"
      preTitle="/"
      subTitle={tProjects("subTitle")}
      showLine={false}
    >
      <div className={classes.container}>
        {projectsGrid({
          title: tProjects("complete-apps"),
          listApps: completeApps,
        })}

        {projectsGrid({
          title: tProjects("small-apps"),
          listApps: smallApps,
        })}
      </div>
    </Section>
  );
}

export const generateMetadata = createI18nMetadata("Projects", routes.projects);
