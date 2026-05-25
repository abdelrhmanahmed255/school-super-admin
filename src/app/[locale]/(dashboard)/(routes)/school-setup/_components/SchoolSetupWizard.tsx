"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentStep } from "@/store/slices/schoolSetup/slice";
import { BasicInfoStep } from "./BasicInfoStep";
import { SubscriptionStep } from "./SubscriptionStep";
import { FeatureFlagsStep } from "./FeatureFlagsStep";
import { CredentialsStep } from "./CredentialsStep";
import { SetupCompleteStep } from "./SetupCompleteStep";
import { SchoolContextBanner } from "./SchoolContextBanner";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType;
}

const STEPS: Step[] = [
  { id: 1, title: "basicInformation", description: "schoolBasicInfo", component: BasicInfoStep },
  { id: 2, title: "subscriptionPlan", description: "chooseSubscriptionPlan", component: SubscriptionStep },
  { id: 3, title: "featureFlags", description: "configureFeatures", component: FeatureFlagsStep },
  { id: 4, title: "adminCredentials", description: "createAdminAccount", component: CredentialsStep },
  { id: 5, title: "setupComplete", description: "reviewSetup", component: SetupCompleteStep },
];

interface SchoolSetupWizardProps {
  onChangeSchool: () => void;
}

export function SchoolSetupWizard({ onChangeSchool }: SchoolSetupWizardProps) {
  const t = useTranslations("schoolSetup");
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state) => state.schoolSetup.currentStep);
  const completedSteps = useAppSelector((state) => state.schoolSetup.completedSteps);

  const activeStep = STEPS.find((s) => s.id === currentStep);
  const ActiveComponent = activeStep?.component;
  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <SchoolContextBanner onChangeSchool={onChangeSchool} />

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">{t("schoolSetupWizard")}</h1>
          <p className="text-muted-foreground text-sm">{t("wizardDescription")}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("step")} {currentStep} {t("of")} {STEPS.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="shadow-xl shadow-black/5 border-border/50">
              <CardContent className="p-4 space-y-3">
                {STEPS.map((step) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-start gap-3 ${step.id <= currentStep ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                    onClick={() => { if (step.id <= currentStep) dispatch(setCurrentStep(step.id)); }}
                    whileHover={{ x: step.id <= currentStep ? 3 : 0 }}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completedSteps.includes(step.id) ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </motion.div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${step.id === currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"}`}>
                          {step.id}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${step.id === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                        {t(step.title)}
                      </p>
                      {step.id === currentStep && (
                        <p className="text-xs text-muted-foreground mt-0.5">{t(step.description)}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-xl shadow-black/5 border-border/50">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {ActiveComponent && <ActiveComponent key={currentStep} />}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">{t("setupWizardFooter")}</p>
      </div>
    </div>
  );
}
