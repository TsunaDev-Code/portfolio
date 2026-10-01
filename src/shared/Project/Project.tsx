import { buttonIcon, ButtonKey } from "@/src/constants/projects";
import { Link } from "@/src/i18n/navigation";
import cn from "clsx";
import Image from "next/image";
import { getColor } from "../lib/get-color";
import classes from "./Project.module.scss";
interface ProjectProps {
  title?: string;
  description?: string;
  image?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  stack?: string[];
  buttons?: { link: string; label: ButtonKey }[];
  translator: Record<ButtonKey, string>;
}

export const Project = ({
  title,
  description,
  image,
  icon,
  stack,
  buttons,
  translator,
}: ProjectProps) => {
  const Icon = icon;

  return (
    <div className={classes.box}>
      {image && (
        <Image
          className={classes.photo}
          src={image}
          alt={title ?? "Project image"}
          width={330}
          height={200}
          loading="lazy"
          unoptimized
        />
      )}
      <div className={classes.content}>
        <div className={classes.info}>
          <div
            className={cn(classes.titleBox, {
              [classes.titleGrid]: Icon,
            })}
          >
            {Icon && (
              <Icon
                className={classes.icon}
                style={{ color: getColor(title) }}
                aria-hidden="true"
              />
            )}
            <div className={classes.skills}>
              {stack?.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <h5 className={classes.title}>{title}</h5>
          </div>
          <p className={classes.description}>{description}</p>
        </div>
        <div className={classes.buttons}>
          {buttons?.map((button, index) => {
            const ButtonIcon = buttonIcon[button.label];
            return (
              <Link
                href={button.link}
                key={index}
                className={classes.button}
                style={{
                  color: button.label !== "git" ? "var(--primary-color)" : "",
                }}
              >
                {translator[button.label]}
                <ButtonIcon />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
