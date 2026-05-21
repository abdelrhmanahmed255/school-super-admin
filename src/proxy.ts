import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const cookieName = "NEXT_LOCALE";
const versionCookieName = "APP_VERSION";

export const currentVersion = "1.1.2";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { cookies } = request;
  const localeCookie = cookies.get(cookieName);
  const versionCookie = cookies.get(versionCookieName);

  let locale = localeCookie?.value || routing.defaultLocale;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const response = intlMiddleware(request);

  if (versionCookie?.value !== currentVersion) {
    response.headers.set("x-app-version-changed", "true");
  }

  if (!localeCookie) {
    response.cookies.set(cookieName, locale, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
