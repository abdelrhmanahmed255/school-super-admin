// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { notFound } from "next/navigation";
import ReduxProvider from "@/store/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "School Super Admin",
  description: "School Super Admin",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const locales = ["ar", "en"];

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // التحقق من صحة اللغة
  if (!locales.includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={` antialiased 
          ${locale === "ar" ? `${cairo.className} font-cairo` : `${geistSans.variable}   ${geistMono.variable}`}
           `}
      >
        <Toaster />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
