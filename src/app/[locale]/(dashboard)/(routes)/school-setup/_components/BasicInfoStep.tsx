"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateBasicInfo,
  setCurrentStep,
  addCompletedStep,
} from "@/store/slices/schoolSetup/slice";
import { saveSetupData } from "@/store/slices/schoolSetup/thunks";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SetupStepNav } from "./SetupStepNav";

const TIMEZONES = [
  "UTC", "Africa/Cairo", "Asia/Riyadh", "Asia/Dubai", "Asia/Kuwait",
  "Asia/Qatar", "Asia/Bahrain", "Asia/Muscat", "America/New_York",
  "America/Chicago", "America/Los_Angeles", "Europe/London", "Europe/Paris",
];
const COUNTRIES = [
  "Egypt", "Saudi Arabia", "UAE", "Kuwait", "Qatar", "Bahrain", "Oman",
  "Jordan", "Lebanon", "Libya", "Morocco", "Tunisia", "Other",
];

export function BasicInfoStep() {
  const t = useTranslations("schoolSetup");
  const dispatch = useAppDispatch();
  const setupData = useAppSelector((state) => state.schoolSetup.setupData);
  const schoolId = useAppSelector((state) => state.schoolSetup.schoolId);
  const saving = useAppSelector((state) => state.schoolSetup.saving);
  const basicInfo = setupData.basicInfo;

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateBasicInfo({ [field]: value }));
  };

  const handleSave = async () => {
    if (!basicInfo.name.trim()) { toast.error(t("schoolNameRequired")); return; }
    if (schoolId) {
      await dispatch(saveSetupData({ schoolId, setupData, step: 1 }));
      toast.success(t("savedSuccessfully"));
    }
  };

  const handleNext = async () => {
    if (!basicInfo.name.trim()) { toast.error(t("schoolNameRequired")); return; }
    if (schoolId) {
      await dispatch(saveSetupData({ schoolId, setupData, step: 1 }));
    }
    dispatch(addCompletedStep(1));
    dispatch(setCurrentStep(2));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{t("basicInformation")}</CardTitle>
          <CardDescription>{t("basicInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium">
                {t("schoolName")} <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={t("schoolNamePlaceholder")}
                value={basicInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("schoolCode")}</label>
              <Input
                placeholder={t("schoolCodePlaceholder")}
                value={basicInfo.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("email")}</label>
              <Input
                type="email"
                placeholder="admin@school.edu"
                value={basicInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("phone")}</label>
              <Input
                placeholder="+966-11-000-0000"
                value={basicInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("website")}</label>
              <Input
                type="url"
                placeholder="https://school.edu"
                value={basicInfo.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium">{t("address")}</label>
              <Input
                placeholder={t("addressPlaceholder")}
                value={basicInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("city")}</label>
              <Input
                placeholder={t("cityPlaceholder")}
                value={basicInfo.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("country")}</label>
              <Select
                value={basicInfo.country}
                onValueChange={(v) => handleInputChange("country", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t("selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{t("timezone")}</label>
              <Select
                value={basicInfo.timezone}
                onValueChange={(v) => handleInputChange("timezone", v)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t("selectTimezone")} />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <SetupStepNav
        backDisabled
        onNext={handleNext}
        onSave={handleSave}
        showSave
        saving={saving}
      />
    </motion.div>
  );
}
