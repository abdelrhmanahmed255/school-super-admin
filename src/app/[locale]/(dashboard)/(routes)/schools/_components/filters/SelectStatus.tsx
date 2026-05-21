"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setStatusFilter } from "@/store/slices/schools/slice";
import { useTranslations } from "next-intl";

function SelectStatus() {
  const t = useTranslations("schoolsPage");
  const dispatch = useDispatch<AppDispatch>();
  const { statusFilter } = useSelector((state: RootState) => state.schools);
  const statuses = ["All", "active", "inactive"];

  return (
    <Select
      value={statusFilter}
      onValueChange={(val) => dispatch(setStatusFilter(val))}
      defaultValue={statusFilter}
    >
      <SelectTrigger className="min-w-32 bg-white dark:bg-dark">
        <SelectValue placeholder={t("All")} />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((item) => (
          <SelectItem key={item} value={item}>
            {t(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectStatus;
