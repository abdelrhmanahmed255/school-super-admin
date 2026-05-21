"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Locale = "ar" | "en";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [locale, setLocale] = useState<Locale>("ar");
  const [isLoading, setIsLoading] = useState(false);

  // المسار هو مصدر الحقيقة (مثل /ar/application ↔ /en/application)
  useEffect(() => {
    const match = pathname.match(/^\/(ar|en)(\/|$)/);
    const fromPath = match?.[1] as Locale | undefined;
    if (fromPath === "ar" || fromPath === "en") {
      setLocale(fromPath);
      return;
    }
    const storedLocale = localStorage.getItem("locale") as Locale | null;
    if (storedLocale === "ar" || storedLocale === "en") {
      setLocale(storedLocale);
    }
  }, [pathname]);

  const switchLanguage = () => {
    if (isLoading) return;

    const nextLocale: Locale = locale === "ar" ? "en" : "ar";
    setIsLoading(true);

    try {
      localStorage.setItem("locale", nextLocale);
      setLocale(nextLocale);

      const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

      const searchParams = window.location.search;
      const newPath = `/${nextLocale}${pathWithoutLocale}${searchParams}`;

      router.push(newPath, { scroll: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLanguage}
      disabled={isLoading}
      className="   hover:bg-primary hover:text-white  h-8"
    >
      {locale === "ar" ? "EN" : "AR"}
    </Button>
  );
};

export default LanguageSwitcher;
