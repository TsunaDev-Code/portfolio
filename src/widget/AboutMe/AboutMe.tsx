import Dots from "@/public/icons/dots.svg";
import { Link } from "@/src/i18n/navigation";
import { Button, Section } from "@/src/shared";
import cn from "clsx";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import classes from "./AboutMe.module.scss";

interface AboutMeProps {
  preTitle?: string;
  showLine?: boolean;
  subTitle?: string;
  showReadMore?: boolean;
}

export const AboutMe = async ({
  preTitle,
  subTitle,
  showLine = true,
  showReadMore = true,
}: AboutMeProps) => {
  const tTitle = await getTranslations("Header");
  const tAbout = await getTranslations("AboutMe");
  const info: string[] = tAbout.raw("info");

  return (
    <Section
      title={tTitle("about-me")}
      preTitle={preTitle}
      subTitle={subTitle}
      showLine={showLine}
    >
      <div className={classes.info}>
        {info.map((item) => (
          <p key={item}>{item}</p>
        ))}
        {showReadMore && (
          <Link href="/about">
            <Button>{tAbout("readMoreBtn") + " ->"}</Button>
          </Link>
        )}
      </div>
      <div className={classes.container}>
        <Image
          className={classes.photo}
          src="/about-me.png"
          alt="About me photo"
          width={343}
          height={500}
          loading="lazy"
        />
        <Dots className={cn(classes.dotsImg, classes.leftDots)} />
        <Dots className={cn(classes.dotsImg, classes.rightDots)} />
      </div>
    </Section>
  );
};
