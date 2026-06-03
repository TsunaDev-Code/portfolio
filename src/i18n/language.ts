import { Locale } from "./config";
import en from "./language/en.json";
import privacyEn from "./language/en.privacy.json";
import projectsEn from "./language/en.projects.json";

import ru from "./language/ru.json";
import privacyRu from "./language/ru.privacy.json";
import projectsRu from "./language/ru.projects.json";

export const messagesByLocale: Record<Locale, typeof ru> = {
  ru: {
    ...ru,
    Projects: { ...ru.Projects, ...projectsRu },
    Privacy: { ...ru.Privacy, ...privacyRu },
  },
  en: {
    ...en,
    Projects: { ...en.Projects, ...projectsEn },
    Privacy: { ...en.Privacy, ...privacyEn },
  },
};

export function getMessages(locale: Locale): typeof ru {
  return messagesByLocale[locale];
}
