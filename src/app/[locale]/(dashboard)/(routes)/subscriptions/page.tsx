"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Clock, CheckCircle2, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mockData";

const TIER_STYLES: Record<string, string> = {
  free: "bg-gray-100 text-gray-700 border-gray-200",
  basic: "bg-blue-100 text-blue-700 border-blue-200",
  premium: "bg-indigo-100 text-indigo-700 border-indigo-200",
  enterprise: "bg-purple-100 text-purple-700 border-purple-200",
};
const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  trial: "bg-yellow-100 text-yellow-700 border-yellow-200",
  expired: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function SubscriptionsPage() {
  const t = useTranslations("subscriptionsPage");
  const locale = useLocale();
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const TIER_LABELS: Record<string, string> = {
    free: t("free"), basic: t("basic"), premium: t("premium"), enterprise: t("enterprise"),
  };
  const STATUS_LABELS: Record<string, string> = {
    active: t("active"), trial: t("trial"), expired: t("expired"),
  };

  const filtered = MOCK_SUBSCRIPTIONS.filter((s) => {
    if (tierFilter !== "all" && s.tier !== tierFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const stats = [
    { label: t("totalRevenue"), value: `$${MOCK_SUBSCRIPTIONS.reduce((a, s) => a + s.amount, 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-500" },
    { label: t("activeSubscriptions"), value: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "active").length, icon: CheckCircle2, color: "text-blue-500" },
    { label: t("trialSchools"), value: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "trial").length, icon: Clock, color: "text-yellow-500" },
    { label: t("totalSubscriptions"), value: MOCK_SUBSCRIPTIONS.length, icon: CreditCard, color: "text-primary" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="border-border/50">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <Icon className={`size-8 ${s.color} shrink-0`} />
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-border/50 shadow-xl shadow-black/5">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base">{t("allSubscriptions")}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9">
                <SelectValue placeholder={t("tier")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTiers")}</SelectItem>
                <SelectItem value="free">{t("free")}</SelectItem>
                <SelectItem value="basic">{t("basic")}</SelectItem>
                <SelectItem value="premium">{t("premium")}</SelectItem>
                <SelectItem value="enterprise">{t("enterprise")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="trial">{t("trial")}</SelectItem>
                <SelectItem value="expired">{t("expired")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border/60 bg-card hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{sub.schoolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.billingCycle === "annually" ? t("billingAnnually") : t("billingMonthly")} · {t("expires")} {sub.expiryDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${TIER_STYLES[sub.tier] ?? ""}`}>{TIER_LABELS[sub.tier] ?? sub.tier}</Badge>
                  <Badge className={`${STATUS_STYLES[sub.status] ?? ""}`}>{STATUS_LABELS[sub.status] ?? sub.status}</Badge>
                  <span className="text-sm font-bold">
                    {sub.amount > 0 ? `$${sub.amount.toLocaleString()}` : t("free")}
                  </span>
                  <Button variant="ghost" size="icon" className="size-8" asChild>
                    <Link href={`/${locale}/school-setup?schoolId=${sub.schoolId}`}>
                      <Settings2 className="size-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">{t("noResults")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
