import Email from "@/public/icons/email.svg";
import Git from "@/public/icons/git.svg";
import LinkedIn from "@/public/icons/linkedIn.svg";
import Telegram from "@/public/icons/telegram.svg";
import Vk from "@/public/icons/vk.svg";

export type MediaKey =
  | "git"
  | "telegram"
  | "tgBlog"
  | "vk"
  | "linkedIn"
  | "email";
export interface SocialLink {
  url: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const media: Record<MediaKey, SocialLink> = {
  git: {
    url: "https://github.com/TsunaDev-Code",
    title: "TsunaDev",
    icon: Git,
  },
  telegram: {
    url: "tg://resolve?domain=tsuna_dev",
    title: "tsuna_dev",
    icon: Telegram,
  },
  tgBlog: {
    url: "tg://resolve?domain=tsuna_channel",
    title: "TsunaLife",
    icon: Telegram,
  },
  vk: {
    url: "https://vk.com/tsuna_28",
    title: "tsuna_28",
    icon: Vk,
  },
  linkedIn: {
    url: "https://www.linkedin.com/in/anna-tsyganova/",
    title: "anna-tsyganova",
    icon: LinkedIn,
  },
  email: {
    url: "mailto:info@tsuna-dev.com",
    title: "info@tsuna-dev.com",
    icon: Email,
  },
};

export const mediaLinks: MediaKey[] = ["git", "telegram", "vk"];
export const contactLinks: MediaKey[] = ["email", "telegram"];
export const footerLinks: MediaKey[] = ["git", "telegram", "linkedIn"];
export const allMediaLinks: MediaKey[] = [
  "telegram",
  "vk",
  "email",
  "linkedIn",
  "git",
];
