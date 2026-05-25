"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Building2, Users, GraduationCap, BookOpen,
  TrendingUp, Activity, CreditCard, School,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_ANALYTICS, MOCK_SUBSCRIPTIONS } from "@/lib/mockData";

const TIER_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  basic: "bg-blue-100 text-blue-700",
  premium: "bg-indigo-100 text-indigo-700",
  enterprise: "bg-purple-100 text-purple-700",
};

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  school_created: Building2,
  subscription_upgraded: CreditCard,
  credentials_sent: Users,
  school_activated: Activity,
  subscription_created: TrendingUp,
};

export default function AnalyticsPage() {
  const t = useTranslations("analyticsPage");
  const tDash = useTranslations("dashboardPage");
  const locale = useLocale();

  const overviewCards = [
    { label: t("totalSchools"), value: MOCK_ANALYTICS.overview.totalSchools, icon: Building2, color: "from-blue-500 to-indigo-600" },
    { label: t("activeSchools"), value: MOCK_ANALYTICS.overview.activeSchools, icon: School, color: "from-emerald-500 to-teal-600" },
    { label: t("totalUsers"), value: MOCK_ANALYTICS.overview.totalUsers.toLocaleString(), icon: Users, color: "from-fuchsia-500 to-purple-600" },
    { label: t("totalStudents"), value: MOCK_ANALYTICS.overview.totalStudents.toLocaleString(), icon: GraduationCap, color: "from-orange-500 to-amber-600" },
  ];

  const tierCounts = MOCK_SUBSCRIPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s.tier] = (acc[s.tier] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="relative overflow-hidden border-border/50">
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${card.color}`} />
                <CardContent className="pt-6 pb-5 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className={`size-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${card.color}`}>
                    <Icon className="size-5 text-white" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">{t("schoolGrowth")}</CardTitle>
              <CardDescription>{t("schoolGrowthDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {MOCK_ANALYTICS.schoolGrowth.map((d, i) => {
                  const maxSchools = Math.max(...MOCK_ANALYTICS.schoolGrowth.map((x) => x.schools));
                  const height = `${(d.schools / maxSchools) * 100}%`;
                  const monthLabel = new Intl.DateTimeFormat(locale, { month: "short" }).format(
                    new Date(2026, d.monthIndex, 1),
                  );
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="w-full rounded-t-md bg-primary/80"
                          style={{ minHeight: "8px" }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{monthLabel}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">{t("subscriptionBreakdown")}</CardTitle>
              <CardDescription>{t("subscriptionBreakdownDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(tierCounts).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`capitalize ${TIER_COLORS[tier]}`}>{tier}</Badge>
                    <span className="text-sm">{count} {t("schools")}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1 mx-4">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / MOCK_SUBSCRIPTIONS.length) * 100}%` }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground w-8 text-right">
                    {Math.round((count / MOCK_SUBSCRIPTIONS.length) * 100)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">{t("activityFeed")}</CardTitle>
            <CardDescription>{t("activityFeedDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {MOCK_ANALYTICS.recentActivity.map((item, i) => {
                  const Icon = ACTIVITY_ICONS[item.type] ?? Activity;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.07 }}
                      className="flex items-center gap-3 pl-8"
                    >
                      <div className="absolute left-2 size-5 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background">
                        <Icon className="size-2.5 text-primary" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <p className="text-sm">{tDash(item.messageKey as Parameters<typeof tDash>[0], { name: item.name })}</p>
                        <span className="text-xs text-muted-foreground shrink-0 ml-4">{tDash(item.timeKey as Parameters<typeof tDash>[0])}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
