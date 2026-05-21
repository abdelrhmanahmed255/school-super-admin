import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ requestLocale }) => {
  // استخدم requestLocale بدلاً من locale
  let locale = await requestLocale;

  // التحقق من صحة اللغة
  const locales = ["ar", "en"];
  if (!locale || !locales.includes(locale)) {
    locale = "ar"; // اللغة الافتراضية
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
