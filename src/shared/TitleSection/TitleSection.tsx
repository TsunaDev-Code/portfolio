import { ReactNode } from "react";
import { Title } from "../Title/Title";
import classes from "./TitleSection.module.scss";

interface TitleSectionProps {
  title: string;
  preTitle?: string;
  showLine?: boolean;
  subTitle?: string;
  buttons?: ReactNode;
  titleTag?: "h1" | "h2" | "h3";
}

export const TitleSection = ({
  title,
  preTitle = "#",
  showLine = true,
  subTitle,
  buttons,
  titleTag = "h2",
}: TitleSectionProps) => {
  return (
    <div className={classes.section}>
      <div className={classes.titleAndButton}>
        <div className={classes.title}>
          <Title title={title} preTitle={preTitle} titleTag={titleTag} />
          {showLine && <div className={classes.line} />}
        </div>
        {buttons && <>{buttons}</>}
      </div>
      {subTitle && <p>{subTitle}</p>}
    </div>
  );
};
