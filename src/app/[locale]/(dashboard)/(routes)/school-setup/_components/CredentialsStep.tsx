"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateAdminCredentials,
  setCurrentStep,
  addCompletedStep,
} from "@/store/slices/schoolSetup/slice";
import { saveSetupData } from "@/store/slices/schoolSetup/thunks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  KeyRound,
  Copy,
  CheckCheck,
  RefreshCw,
  ShieldCheck,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { SetupStepNav } from "./SetupStepNav";
import { SetupInfoBox } from "./SetupInfoBox";

function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "@#$!";
  const all = upper + lower + digits + special;
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < 12; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

export function CredentialsStep() {
  const t = useTranslations("schoolSetup");
  const dispatch = useAppDispatch();
  const setupData = useAppSelector((state) => state.schoolSetup.setupData);
  const schoolId = useAppSelector((state) => state.schoolSetup.schoolId);
  const saving = useAppSelector((state) => state.schoolSetup.saving);
  const creds = setupData.adminCredentials;
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<"password" | "all" | null>(null);

  const handleChange = (field: "name" | "email", value: string) => {
    dispatch(updateAdminCredentials({ [field]: value }));
  };

  const handleGenerate = () => {
    const pwd = generatePassword();
    dispatch(updateAdminCredentials({ temporaryPassword: pwd }));
    toast.success(t("passwordGenerated"));
  };

  const copyToClipboard = async (text: string, type: "password" | "all") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(t("copied"));
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMarkSent = () => {
    dispatch(updateAdminCredentials({ credentialsSent: true }));
    toast.success(t("credentialsMarkedSent"));
  };

  const handleNext = async () => {
    if (!creds.name.trim() || !creds.email.trim()) {
      toast.error(t("adminNameEmailRequired"));
      return;
    }
    if (!creds.temporaryPassword) {
      toast.error(t("generatePasswordFirst"));
      return;
    }
    if (schoolId) {
      await dispatch(saveSetupData({ schoolId, setupData, step: 4 }));
    }
    dispatch(addCompletedStep(4));
    dispatch(setCurrentStep(5));
  };

  const handleBack = () => dispatch(setCurrentStep(3));

  const allCredentials = `School Admin Credentials\n\nName: ${creds.name}\nEmail: ${creds.email}\nTemporary Password: ${creds.temporaryPassword}\n\nPlease log in and change your password on first login.`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            {t("adminAccount")}
          </CardTitle>
          <CardDescription>{t("adminAccountDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("adminName")} <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={t("adminNamePlaceholder")}
                value={creds.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("adminEmail")} <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="admin@school.edu"
                value={creds.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("temporaryPassword")}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={creds.temporaryPassword}
                  readOnly
                  placeholder={t("generatePasswordHint")}
                  className="h-10 font-mono pr-10"
                />
                {creds.temporaryPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                className="shrink-0"
              >
                <RefreshCw className="size-4 mr-1" />
                {t("generate")}
              </Button>
              {creds.temporaryPassword && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyToClipboard(creds.temporaryPassword, "password")}
                  className="shrink-0"
                >
                  {copied === "password" ? (
                    <CheckCheck className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {creds.temporaryPassword && creds.name && creds.email && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" />
                  {t("credentialsSummary")}
                </CardTitle>
                {creds.credentialsSent && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCheck className="size-3 mr-1" />
                    {t("sent")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2 text-sm font-mono bg-muted/50 p-4 rounded-lg border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("name")}:</span>
                  <span className="font-semibold">{creds.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("email")}:</span>
                  <span className="font-semibold">{creds.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("temporaryPassword")}:</span>
                  <span className="font-semibold">{showPassword ? creds.temporaryPassword : "••••••••••••"}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(allCredentials, "all")}
                  className="flex-1"
                >
                  {copied === "all" ? (
                    <CheckCheck className="size-4 mr-1 text-green-500" />
                  ) : (
                    <Copy className="size-4 mr-1" />
                  )}
                  {t("copyAll")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleMarkSent}
                  disabled={creds.credentialsSent}
                >
                  <Mail className="size-4 mr-1" />
                  {creds.credentialsSent ? t("credentialsSent") : t("markAsSent")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <SetupInfoBox>{t("credentialsInfo")}</SetupInfoBox>
      <SetupStepNav
        onBack={handleBack}
        onNext={handleNext}
        saving={saving}
        nextDisabled={!creds.name || !creds.email || !creds.temporaryPassword}
      />
    </motion.div>
  );
}
