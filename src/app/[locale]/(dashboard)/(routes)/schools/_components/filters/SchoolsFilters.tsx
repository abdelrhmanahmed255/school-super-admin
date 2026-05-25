"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import SelectStatus from "./SelectStatus";
import SeachBar from "./SeachBar";
import AddSchool from "../addSchool/AddSchool";

function SchoolsFilters() {
  const t = useTranslations("schoolsPage");
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <SeachBar />
        <SelectStatus />
      </div>
      <AddSchool>
        <Button variant="default" className="w-full sm:w-auto gap-2 shrink-0">
          <Plus className="size-4" />
          {t("addSchool")}
        </Button>
      </AddSchool>
    </div>
  );
}

export default SchoolsFilters;
