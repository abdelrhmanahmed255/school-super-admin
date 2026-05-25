"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Settings, Shield, Globe, Bell, Database, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface GlobalSetting {
  key: string;
  value: boolean;
}

const DEFAULT_SETTINGS: GlobalSetting[] = [
  { key: "maintenanceMode", value: false },
  { key: "newSchoolRegistration", value: true },
  { key: "emailNotifications", value: true },
  { key: "smsNotifications", value: false },
  { key: "autoBackup", value: true },
  { key: "auditLogs", value: true },
  { key: "twoFactorAuth", value: false },
  { key: "apiAccess", value: true },
];

export default function SettingsPage() {
  const t = useTranslations("settingsPage");
  const [settings, setSettings] = useState<GlobalSetting[]>(DEFAULT_SETTINGS);
  const [apiKey] = useState("sk-live-••••••••••••••••••••••••••••");
  const [copied, setCopied] = useState(false);

  const toggle = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: !s.value } : s)),
    );
    toast.success(t("settingUpdated"));
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("sk-live-supersecret-demo-key-12345");
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const groups = [
    { title: t("platformSettings"), icon: Settings, keys: ["maintenanceMode", "newSchoolRegistration"] },
    { title: t("notificationsSettings"), icon: Bell, keys: ["emailNotifications", "smsNotifications"] },
    { title: t("securitySettings"), icon: Shield, keys: ["twoFactorAuth", "auditLogs"] },
    { title: t("systemSettings"), icon: Database, keys: ["autoBackup", "apiAccess"] },
  ];

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group, gi) => {
          const Icon = group.icon;
          return (
            <motion.div key={gi} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.keys.map((key) => {
                    const setting = settings.find((s) => s.key === key);
                    if (!setting) return null;
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          setting.value ? "bg-primary/5 border border-primary/20" : "bg-muted/40"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium">{t(key)}</p>
                          <p className="text-xs text-muted-foreground">{t(`${key}Desc`)}</p>
                        </div>
                        <Switch checked={setting.value} onCheckedChange={() => toggle(key)} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="size-4 text-primary" />
              {t("apiKeys")}
            </CardTitle>
            <CardDescription>{t("apiKeysDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={apiKey} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={handleCopyKey}>
                {copied ? t("copied") : t("copy")}
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Globe className="size-3 mr-1" />
              {t("productionKey")}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
