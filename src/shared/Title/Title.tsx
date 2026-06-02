import { ElementType } from "react";
import classes from "./Title.module.scss";

interface TitleProps {
  title: string;
  preTitle?: string;
  titleTag?: ElementType;
}

export const Title = ({
  title,
  preTitle = "#",
  titleTag = "h2",
}: TitleProps) => {
  const Tag: ElementType = titleTag;

  return (
    <Tag className={classes.label}>
      <span className={classes.sharp}>{preTitle}</span>
      {title}
    </Tag>
  );
};
