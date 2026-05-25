"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateSubscription,
  setCurrentStep,
  addCompletedStep,
} from "@/store/slices/schoolSetup/slice";
import type { SubscriptionTier, BillingCycle } from "@/store/slices/schoolSetup/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Zap, Shield, Building2 } from "lucide-react";
import { SetupStepNav } from "./SetupStepNav";
import { SetupInfoBox } from "./SetupInfoBox";

interface PlanDef {
  tier: SubscriptionTier;
  price: { monthly: number; annually: number };
  icon: React.ElementType;
  color: string;
  popular?: boolean;
  featureKeys: string[];
}

const PLAN_DEFS: PlanDef[] = [
  {
    tier: "free",
    price: { monthly: 0, annually: 0 },
    icon: Shield,
    color: "text-gray-500",
    featureKeys: ["feat_100students", "feat_basicLms", "feat_attendance", "feat_basicReports"],
  },
  {
    tier: "basic",
    price: { monthly: 99, annually: 79 },
    icon: Zap,
    color: "text-blue-500",
    featureKeys: [
      "feat_500students",
      "feat_fullLms",
      "feat_parentPortal",
      "feat_onlinePayments",
      "feat_library",
      "feat_analyticsReports",
    ],
  },
  {
    tier: "premium",
    price: { monthly: 199, annually: 159 },
    icon: Star,
    color: "text-primary",
    popular: true,
    featureKeys: [
      "feat_unlimitedStudents",
      "feat_allBasicFeatures",
      "feat_smsNotifications",
      "feat_advancedAnalytics",
      "feat_transport",
      "feat_hrModule",
      "feat_inventory",
    ],
  },
  {
    tier: "enterprise",
    price: { monthly: 0, annually: 0 },
    icon: Building2,
    color: "text-purple-600",
    featureKeys: [
      "feat_allPremiumFeatures",
      "feat_customDomain",
      "feat_dedicatedSupport",
      "feat_sla",
      "feat_apiAccess",
      "feat_customIntegrations",
    ],
  },
];

export function SubscriptionStep() {
  const t = useTranslations("schoolSetup");
  const dispatch = useAppDispatch();
  const { tier, billingCycle } = useAppSelector(
    (state) => state.schoolSetup.setupData.subscription,
  );

  const handleTierSelect = (newTier: SubscriptionTier) =>
    dispatch(updateSubscription({ tier: newTier }));

  const handleBillingChange = (cycle: BillingCycle) =>
    dispatch(updateSubscription({ billingCycle: cycle }));

  const handleNext = () => {
    dispatch(addCompletedStep(2));
    dispatch(setCurrentStep(3));
  };

  const handleBack = () => dispatch(setCurrentStep(1));

  const annualDiscount = 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant={billingCycle === "monthly" ? "default" : "outline"}
          onClick={() => handleBillingChange("monthly")}
          className="px-6"
        >
          {t("monthly")}
        </Button>
        <Button
          size="sm"
          variant={billingCycle === "annually" ? "default" : "outline"}
          onClick={() => handleBillingChange("annually")}
          className="px-6"
        >
          {t("annually")}
          <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
            -{annualDiscount}%
          </Badge>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLAN_DEFS.map((plan) => {
          const isSelected = tier === plan.tier;
          const price =
            plan.tier === "enterprise"
              ? t("custom")
              : billingCycle === "annually"
              ? `$${plan.price.annually}`
              : `$${plan.price.monthly}`;

          const Icon = plan.icon;

          return (
            <motion.div key={plan.tier} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                onClick={() => handleTierSelect(plan.tier)}
                className={`cursor-pointer transition-all border-2 relative overflow-hidden h-full ${
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border/60 hover:border-primary/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      {t("popular")}
                    </div>
                  </div>
                )}

                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <Icon className={`size-5 ${isSelected ? "text-primary" : plan.color}`} />
                    </div>
                    <div>
                      <p className="font-bold capitalize text-base">{t(plan.tier)}</p>
                      <p className="text-lg font-bold text-foreground">
                        {price}
                        {plan.tier !== "enterprise" && (
                          <span className="text-xs text-muted-foreground font-normal ml-1">
                            /{t("mo")}
                          </span>
                        )}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="size-5 text-primary ml-auto shrink-0" />
                    )}
                  </div>

                  <ul className="space-y-1.5">
                    {plan.featureKeys.map((key) => (
                      <li key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                        {t(key)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <SetupInfoBox>{t("subscriptionInfo")}</SetupInfoBox>
      <SetupStepNav onBack={handleBack} onNext={handleNext} />
    </motion.div>
  );
}
