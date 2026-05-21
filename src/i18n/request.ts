import { getRequestConfig } from "next-intl/server";
import { locales } from "../lib/i18n";

type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : "en";

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
