import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales: Array<"en" | "ar"> = ["en", "ar"];
const defaultLocale: "en" | "ar" = "ar";

const cookieName = "NEXT_LOCALE";
const versionCookieName = "APP_VERSION";

export const currentVersion = "1.1.2"; // ← غيّره عند كل نشر جديد

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export default function middleware(request: NextRequest) {
  const { cookies } = request;
  const localeCookie = cookies.get(cookieName);
  const versionCookie = cookies.get(versionCookieName);

  let locale = localeCookie?.value || defaultLocale;
  if (!locales.includes(locale as "en" | "ar")) {
    locale = defaultLocale;
  }

  const response = intlMiddleware(request);

  // ✅ إذا النسخة مختلفة، أرسل إشعار للكلاينت لتسجيل الخروج
  if (versionCookie?.value !== currentVersion) {
    response.headers.set("x-app-version-changed", "true");
    // response.cookies.set(versionCookieName, currentVersion, {
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 365,
    // });
  }

  // /✅ تعيين اللغة إذا لم تكن موجودة
  if (!localeCookie) {
    response.cookies.set(cookieName, locale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
