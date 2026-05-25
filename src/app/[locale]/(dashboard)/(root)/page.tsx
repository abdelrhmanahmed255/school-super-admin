"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSchools, fetchStatsSchools } from "@/store/slices/schools/thunks";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, Users, GraduationCap, CreditCard,
  ArrowRight, Plus, Settings2, BarChart3,
  TrendingUp, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_ANALYTICS } from "@/lib/mockData";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, type: "spring" as const, stiffness: 120, damping: 14 } }),
};

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  school_created: Building2,
  subscription_upgraded: CreditCard,
  credentials_sent: Users,
  school_activated: Activity,
  subscription_created: TrendingUp,
};

export default function DashboardPage() {
  const t = useTranslations("dashboardPage");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { schools, loading, statsSchools, loadingStats } = useAppSelector((s) => s.schools);

  useEffect(() => {
    dispatch(fetchSchools({ page: 1 }));
    dispatch(fetchStatsSchools());
  }, [dispatch]);

  const statCards = [
    {
      title: t("totalSchools"),
      value: statsSchools?.total_schools ?? schools.length,
      icon: Building2,
      gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
      sub: t("activeSchools"),
    },
    {
      title: t("totalUsers"),
      value: statsSchools?.total_users ?? 0,
      icon: Users,
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-600",
      sub: t("acrossAllSchools"),
    },
    {
      title: t("totalStudents"),
      value: statsSchools?.total_students ?? 0,
      icon: GraduationCap,
      gradient: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
      sub: t("enrolledStudents"),
    },
    {
      title: t("activeSubscriptions"),
      value: statsSchools?.active_subscriptions ?? 0,
      icon: CreditCard,
      gradient: "bg-gradient-to-r from-orange-500 to-amber-600",
      sub: t("paidPlans"),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("platformDashboard")}</h2>
        <p className="text-muted-foreground text-sm">{t("platformDashboardDesc")}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
                <div className={`absolute top-0 inset-x-0 h-1 ${card.gradient}`} />
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                      {loadingStats ? (
                        <Skeleton className="h-9 w-20" />
                      ) : (
                        <p className="text-3xl font-bold">{Number(card.value || 0).toLocaleString()}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{card.sub}</p>
                    </div>
                    <div className={`shrink-0 rounded-xl p-2.5 ${card.gradient} bg-opacity-10`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-base">{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start gap-3" size="lg">
                <Link href={`/${locale}/school-setup`}>
                  <Plus className="size-4" />
                  {t("onboardNewSchool")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
                <Link href={`/${locale}/schools`}>
                  <Building2 className="size-4" />
                  {t("viewAllSchools")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
                <Link href={`/${locale}/subscriptions`}>
                  <CreditCard className="size-4" />
                  {t("manageSubscriptions")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-3" size="lg">
                <Link href={`/${locale}/analytics`}>
                  <BarChart3 className="size-4" />
                  {t("viewAnalytics")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Schools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{t("recentSchools")}</CardTitle>
                <CardDescription>{t("latestOnboardedSchools")}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/schools`}>
                  {t("viewAll")} <ArrowRight className="size-3 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {schools.slice(0, 5).map((school: any) => (
                    <div key={school.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{school.name}</p>
                          <p className="text-xs text-muted-foreground">{school.city}, {school.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={school.status === "active" ? "default" : "secondary"} className="text-xs">
                          {school.status === "active" ? t("active") : t("inactive")}
                        </Badge>
                        <Button variant="ghost" size="icon" className="size-7" asChild>
                          <Link href={`/${locale}/school-setup?schoolId=${school.id}`}>
                            <Settings2 className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {schools.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">{t("noSchoolsYet")}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">{t("recentActivity")}</CardTitle>
            <CardDescription>{t("recentActivityDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_ANALYTICS.recentActivity.map((item) => {
                const Icon = ACTIVITY_ICONS[item.type] ?? Activity;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{t(item.messageKey as Parameters<typeof t>[0], { name: item.name })}</p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">{t(item.timeKey as Parameters<typeof t>[0])}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
