"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSchools } from "@/store/slices/schools/thunks";
import { setSchoolId, updateBasicInfo, setCurrentStep } from "@/store/slices/schoolSetup/slice";
import { fetchSchoolSetupData } from "@/store/slices/schoolSetup/thunks";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Building2, Search, ChevronRight, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { School as SchoolType } from "@/store/slices/schools/type";
import Link from "next/link";

interface SchoolSelectorProps {
  onSchoolSelected: () => void;
}

export function SchoolSelector({ onSchoolSelected }: SchoolSelectorProps) {
  const t = useTranslations("schoolSetup");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { schools, loading } = useAppSelector((state) => state.schools);
  const setupLoading = useAppSelector((state) => state.schoolSetup.loading);
  const [search, setSearch] = useState("");
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSchools({ page: 1 }));
  }, [dispatch]);

  const filtered = schools.filter((s: SchoolType) =>
    s.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = async (school: SchoolType) => {
    const id = String(school.id);
    setSelectingId(id);
    dispatch(setSchoolId({ id, name: school.name }));
    if (school.name) dispatch(updateBasicInfo({ name: school.name }));
    if (school.address) dispatch(updateBasicInfo({ address: school.address }));
    if (school.city) dispatch(updateBasicInfo({ city: school.city }));
    if (school.state) dispatch(updateBasicInfo({ state: school.state }));
    if (school.country) dispatch(updateBasicInfo({ country: school.country }));
    if (school.phone) dispatch(updateBasicInfo({ phone: school.phone }));
    if (school.email) dispatch(updateBasicInfo({ email: school.email }));
    if (school.website) dispatch(updateBasicInfo({ website: school.website }));
    await dispatch(fetchSchoolSetupData(id));
    dispatch(setCurrentStep(1));
    setSelectingId(null);
    onSchoolSelected();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="inline-flex size-16 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Building2 className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("selectSchoolTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("selectSchoolDescription")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t("searchSchoolPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-border/50 shadow-xl shadow-black/5">
            <CardContent className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-muted-foreground">{t("noSchoolsToConfigure")}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/schools`}>
                      <Plus className="size-4 mr-1" />
                      {t("createSchoolFirst")}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((school: SchoolType) => {
                    const isLoading = selectingId === String(school.id) && setupLoading;
                    return (
                      <motion.div key={school.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}>
                        <button
                          onClick={() => handleSelect(school)}
                          disabled={!!selectingId}
                          className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-primary/5 hover:border-primary/30 border border-transparent transition-all text-left disabled:opacity-60"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Building2 className="size-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{school.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {[school.city, school.country].filter(Boolean).join(", ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={school.status === "active" ? "default" : "secondary"} className="text-xs">
                              {school.status}
                            </Badge>
                            {isLoading ? (
                              <Loader2 className="size-4 animate-spin text-primary" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
