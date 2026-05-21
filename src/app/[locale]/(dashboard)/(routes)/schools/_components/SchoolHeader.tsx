"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStatsSchools } from "@/store/slices/schools/thunks";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Building,
  Users,
  GraduationCap,
  Users2,
  BookOpenCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "@/store";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  gradient: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  gradient,
}: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 h-full">
        {/* Gradient accent bar */}
        <div
          className={`absolute top-0 inset-x-0 h-1 ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
        />
        <CardContent className="pt-6 pb-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">
                {title}
              </p>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <p className="text-3xl font-bold tracking-tight tabular-nums">
                  {value?.toLocaleString() || 0}
                </p>
              )}
            </div>
            <div
              className={`shrink-0 rounded-xl p-2.5 ${gradient} bg-opacity-10 backdrop-blur-sm`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SchoolsHeader() {
  const t = useTranslations("schoolsPage");
  const dispatch = useAppDispatch();
  const { statsSchools, loadingStats } = useAppSelector(
    (state: RootState) => state.schools,
  );

  useEffect(() => {
    dispatch(fetchStatsSchools());
  }, [dispatch]);

  const statCards = [
    {
      title: t("totalUsers"),
      value: statsSchools.total_users,
      icon: Users,
      gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
    },
    {
      title: t("totalStudents"),
      value: statsSchools.total_students,
      icon: GraduationCap,
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-600",
    },
    {
      title: t("totalTeachers"),
      value: statsSchools.total_teachers,
      icon: BookOpenCheck,
      gradient: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
    },
    {
      title: t("totalClasses"),
      value: statsSchools.total_classes,
      icon: Building,
      gradient: "bg-gradient-to-r from-orange-500 to-amber-600",
    },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t("schoolManagement")}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("schoolsDescription") || ""}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} loading={loadingStats} />
        ))}
      </div>
    </motion.div>
  );
}

export default SchoolsHeader;
