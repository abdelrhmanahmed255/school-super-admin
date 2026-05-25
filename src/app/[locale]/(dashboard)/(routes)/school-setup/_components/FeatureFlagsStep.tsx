"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateFeatureFlags,
  setCurrentStep,
  addCompletedStep,
} from "@/store/slices/schoolSetup/slice";
import type { FeatureFlags } from "@/store/slices/schoolSetup/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  MessageSquare,
  BarChart2,
  CreditCard,
  Library,
  Bus,
  UserCog,
  Package,
  Globe,
} from "lucide-react";
import { SetupStepNav } from "./SetupStepNav";
import { SetupInfoBox } from "./SetupInfoBox";

interface FeatureItem {
  key: keyof FeatureFlags;
  icon: React.ElementType;
  group: string;
}

const FEATURES: FeatureItem[] = [
  { key: "lmsModule", icon: BookOpen, group: "academic" },
  { key: "parentPortal", icon: Users, group: "communication" },
  { key: "smsNotifications", icon: MessageSquare, group: "communication" },
  { key: "advancedAnalytics", icon: BarChart2, group: "academic" },
  { key: "onlinePayments", icon: CreditCard, group: "finance" },
  { key: "libraryModule", icon: Library, group: "operations" },
  { key: "transportModule", icon: Bus, group: "operations" },
  { key: "hrModule", icon: UserCog, group: "operations" },
  { key: "inventoryModule", icon: Package, group: "operations" },
  { key: "customDomain", icon: Globe, group: "platform" },
];

const GROUPS = ["academic", "communication", "finance", "operations", "platform"];

export function FeatureFlagsStep() {
  const t = useTranslations("schoolSetup");
  const dispatch = useAppDispatch();
  const featureFlags = useAppSelector((state) => state.schoolSetup.setupData.featureFlags);
  const tier = useAppSelector((state) => state.schoolSetup.setupData.subscription.tier);

  const handleToggle = (key: keyof FeatureFlags, value: boolean) => {
    dispatch(updateFeatureFlags({ [key]: value }));
  };

  const handleNext = () => {
    dispatch(addCompletedStep(3));
    dispatch(setCurrentStep(4));
  };

  const handleBack = () => dispatch(setCurrentStep(2));

  const enabledCount = Object.values(featureFlags).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("featureFlagsDesc")}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-primary">{enabledCount}</p>
          <p className="text-xs text-muted-foreground">{t("featuresEnabled")}</p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <Badge variant="outline" className="capitalize">{tier}</Badge>
        <span>{t("tierDefaults")}</span>
      </div>

      {GROUPS.map((group) => {
        const groupFeatures = FEATURES.filter((f) => f.group === group);
        return (
          <Card key={group} className="border-border/50">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm capitalize font-semibold text-muted-foreground uppercase tracking-wide">
                {t(group)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {groupFeatures.map((feature) => {
                const Icon = feature.icon;
                const isEnabled = featureFlags[feature.key];
                return (
                  <div
                    key={feature.key}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isEnabled ? "bg-primary/5 border border-primary/20" : "bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center ${
                          isEnabled ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <Icon className={`size-4 ${isEnabled ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isEnabled ? "text-foreground" : "text-muted-foreground"}`}>
                          {t(feature.key)}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(v) => handleToggle(feature.key, v)}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <SetupInfoBox>{t("featureFlagsInfo")}</SetupInfoBox>
      <SetupStepNav onBack={handleBack} onNext={handleNext} />
    </motion.div>
  );
}
