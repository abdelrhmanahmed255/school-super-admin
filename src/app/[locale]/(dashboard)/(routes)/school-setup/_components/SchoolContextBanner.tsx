"use client";

import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";
import { School, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";

export function SchoolContextBanner({ onChangeSchool }: { onChangeSchool?: () => void }) {
  const t = useTranslations("schoolSetup");
  const locale = useLocale();
  const schoolName = useAppSelector((state) => state.schoolSetup.selectedSchoolName);
  const schoolId = useAppSelector((state) => state.schoolSetup.schoolId);

  if (!schoolId || !schoolName) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm">
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <School className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {t("configuringSchool")}
            </p>
            <p className="text-lg font-semibold text-foreground">{schoolName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onChangeSchool && (
            <Button variant="outline" size="sm" onClick={onChangeSchool}>
              {t("changeSchool")}
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/schools`}>
              <ArrowLeft className="size-4 mr-1" />
              {t("backToSchools")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
