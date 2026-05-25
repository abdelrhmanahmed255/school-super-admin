"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSchoolId, resetSetup, updateBasicInfo } from "@/store/slices/schoolSetup/slice";
import { fetchSchoolSetupData } from "@/store/slices/schoolSetup/thunks";
import { fetchSchoolById } from "@/store/slices/schools/thunks";
import { SchoolSelector } from "./_components/SchoolSelector";
import { SchoolSetupWizard } from "./_components/SchoolSetupWizard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchoolSetupPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const schoolIdParam = searchParams.get("schoolId");
  const [initializing, setInitializing] = useState(false);
  const [wizardReady, setWizardReady] = useState(false);
  const currentSchoolId = useAppSelector((s) => s.schoolSetup.schoolId);

  useEffect(() => {
    if (schoolIdParam && schoolIdParam !== currentSchoolId) {
      (async () => {
        setInitializing(true);
        try {
          const schoolResult = await dispatch(fetchSchoolById(schoolIdParam)).unwrap().catch(() => null);
          if (schoolResult) {
            dispatch(setSchoolId({ id: schoolIdParam, name: schoolResult.name }));
            if (schoolResult.name) dispatch(updateBasicInfo({ name: schoolResult.name }));
            if (schoolResult.address) dispatch(updateBasicInfo({ address: schoolResult.address }));
            if (schoolResult.city) dispatch(updateBasicInfo({ city: schoolResult.city }));
            if (schoolResult.country) dispatch(updateBasicInfo({ country: schoolResult.country }));
          } else {
            dispatch(setSchoolId({ id: schoolIdParam }));
          }
          await dispatch(fetchSchoolSetupData(schoolIdParam));
          setWizardReady(true);
        } finally {
          setInitializing(false);
        }
      })();
    } else if (currentSchoolId && !schoolIdParam) {
      setWizardReady(true);
    }
  }, [schoolIdParam]);

  const handleChangeSchool = () => {
    dispatch(resetSetup());
    setWizardReady(false);
  };

  if (initializing) {
    return (
      <div className="min-h-screen p-8 space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="lg:col-span-3 h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!wizardReady && !schoolIdParam) {
    return <SchoolSelector onSchoolSelected={() => setWizardReady(true)} />;
  }

  return <SchoolSetupWizard onChangeSchool={handleChangeSchool} />;
}
