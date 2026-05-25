"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentStep, setSetupComplete, resetSetup } from "@/store/slices/schoolSetup/slice";
import { completeSetup } from "@/store/slices/schoolSetup/thunks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle, Building, CreditCard, ToggleRight, KeyRound, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TIER_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  basic: "bg-blue-100 text-blue-700",
  premium: "bg-primary/10 text-primary",
  enterprise: "bg-purple-100 text-purple-700",
};

export function SetupCompleteStep() {
  const t = useTranslations("schoolSetup");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const setupData = useAppSelector((state) => state.schoolSetup.setupData);
  const schoolId = useAppSelector((state) => state.schoolSetup.schoolId);
  const saving = useAppSelector((state) => state.schoolSetup.saving);

  const enabledFeaturesCount = Object.values(setupData.featureFlags).filter(Boolean).length;

  const summaryItems = [
    {
      icon: Building,
      title: t("basicInformation"),
      detail: setupData.basicInfo.name || "—",
      sub: setupData.basicInfo.city || setupData.basicInfo.country,
    },
    {
      icon: CreditCard,
      title: t("subscriptionPlan"),
      detail: (
        <Badge className={`capitalize ${TIER_COLORS[setupData.subscription.tier] ?? ""}`}>
          {t(setupData.subscription.tier)}
        </Badge>
      ),
      sub: `${setupData.subscription.billingCycle === "annually" ? t("annually") : t("monthly")} · ${setupData.subscription.status}`,
    },
    {
      icon: ToggleRight,
      title: t("featureFlags"),
      detail: `${enabledFeaturesCount} ${t("featuresEnabled")}`,
      sub: t("outOf10"),
    },
    {
      icon: KeyRound,
      title: t("adminCredentials"),
      detail: setupData.adminCredentials.email || "—",
      sub: setupData.adminCredentials.credentialsSent ? t("credentialsSent") : t("pendingSend"),
    },
  ];

  const handleFinish = async () => {
    if (schoolId) {
      await dispatch(completeSetup({ schoolId, setupData })).unwrap().catch(() => {});
    }
    dispatch(setSetupComplete(true));
    router.push(`/${locale}`);
  };

  const handleStartOver = () => {
    dispatch(resetSetup());
    router.push(`/${locale}/school-setup`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold">{t("setupCompleteHeading")}</h2>
        <p className="text-muted-foreground">{t("setupCompleteDescription")}</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{t("setupSummary")}</CardTitle>
          <CardDescription>{t("reviewConfiguredSettings")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summaryItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.title}</p>
                    <div className="font-medium text-sm">{item.detail}</div>
                    {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-1">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{t("nextSteps")}</p>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>{t("nextStepSuperAdmin1")}</li>
          <li>{t("nextStepSuperAdmin2")}</li>
          <li>{t("nextStepSuperAdmin3")}</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button variant="outline" onClick={() => dispatch(setCurrentStep(4))} disabled={saving}>
          {t("back")}
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleStartOver} disabled={saving}>{t("configureAnother")}</Button>
          <Button onClick={handleFinish} size="lg" className="px-8" disabled={saving}>
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t("finishing")}</>
            ) : t("finishSetup")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
