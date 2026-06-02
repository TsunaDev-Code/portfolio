export type AppsKey =
  | "portfolio"
  | "waterSeal"
  | "blog"
  | "pizza"
  | "cinema"
  | "diary"
  | "calendar"
  | "myCharity"
  | "petsShop";
export type ButtonKey = "git" | "project";

export interface AppsContent {
  technologies: string[];
  buttons: { link: string; label: ButtonKey }[];
  image?: string;
}

export const mainApps: AppsKey[] = ["portfolio", "blog", "waterSeal"];
export const completeApps: AppsKey[] = [
  "portfolio",
  "blog",
  "waterSeal",
  "pizza",
  "cinema",
];
export const smallApps: AppsKey[] = [
  "diary",
  "calendar",
  "myCharity",
  "petsShop",
];

export const apps: Record<AppsKey, AppsContent> = {
  portfolio: {
    technologies: ["React", "Next", "TS", "SCSS", "i18n"],
    image: "/projects/portfolio.png",
    buttons: [
      {
        link: "https://github.com/Tsuna08/portfolio",
        label: "git",
      },
    ],
  },
  waterSeal: {
    technologies: ["HTML", "CSS", "JS", "Fabric.JS"],
    image: "/projects/waterSeal.png",
    buttons: [
      {
        link: "https://github.com/Tsuna08/water-seal",
        label: "git",
      },
    ],
  },
  blog: {
    technologies: ["React", "CSS", "TS", "React Hook Form", "Yup", "Firebase"],
    image: "/projects/blog.png",
    buttons: [
      {
        link: "https://github.com/Tsuna08/blog",
        label: "git",
      },
    ],
  },
  pizza: {
    technologies: ["React", "TS", "SCSS", "Axios", "React Hook Form", "Yup"],
    image: "/projects/pizza.png",
    buttons: [
      {
        link: "https://github.com/Tsuna08/pizza-and-co",
        label: "git",
      },
    ],
  },
  cinema: {
    technologies: ["Vue 3", "TS", "Pinia", "Vue Router", "Vite", "Axios"],
    image: "/projects/cinema.png",
    buttons: [
      {
        link: "https://github.com/Tsuna08/prism-cinema",
        label: "git",
      },
    ],
  },
  diary: {
    technologies: ["React", "TypeScript", "Vite", "SCSS"],
    buttons: [
      {
        link: " https://github.com/Tsuna08/personal-diary",
        label: "git",
      },
    ],
  },
  calendar: {
    technologies: ["Vue 3", "TypeScript", "CSS", "i18n"],
    buttons: [
      {
        link: "https://github.com/Tsuna08/calendar",
        label: "git",
      },
    ],
  },
  myCharity: {
    technologies: ["HTML", "CSS", "Sass", "Grid", "Layout", "Flexbox"],
    buttons: [
      {
        link: "https://github.com/Tsuna08/my-charity",
        label: "git",
      },
    ],
  },
  petsShop: {
    technologies: ["HTML", "CSS", "Grid", "Layout", "Flexbox"],
    buttons: [
      {
        link: "https://github.com/Tsuna08/pets-shop",
        label: "git",
      },
    ],
  },
};
