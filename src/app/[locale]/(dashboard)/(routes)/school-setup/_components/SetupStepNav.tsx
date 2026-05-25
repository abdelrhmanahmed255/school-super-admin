"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface SetupStepNavProps {
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  showSave?: boolean;
  saving?: boolean;
  nextLabel?: string;
}

export function SetupStepNav({
  onBack,
  onNext,
  onSave,
  backDisabled = false,
  nextDisabled = false,
  showSave = false,
  saving = false,
  nextLabel,
}: SetupStepNavProps) {
  const t = useTranslations("schoolSetup");

  return (
    <div className="flex justify-between gap-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={backDisabled || saving || !onBack}
      >
        {t("back")}
      </Button>
      <div className="flex gap-2">
        {showSave && onSave && (
          <Button variant="outline" onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        )}
        {onNext && (
          <Button onClick={onNext} className="px-8" disabled={nextDisabled || saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("saving")}
              </>
            ) : (
              nextLabel ?? t("next")
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
