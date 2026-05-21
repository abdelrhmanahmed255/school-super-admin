"use client";
import { Search, X } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setSearchName } from "@/store/slices/schools/slice";
import { useTranslations } from "next-intl";

function SeachBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { searchName } = useSelector((state: RootState) => state.schools);
  const t = useTranslations("schoolsPage");
  const [localValue, setLocalValue] = React.useState(searchName);

  React.useEffect(() => {
    setLocalValue(searchName);
  }, [searchName]);

  const handleSearch = () => {
    dispatch(setSearchName(localValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setLocalValue("");
    dispatch(setSearchName(""));
  };

  return (
    <div className="border flex items-center gap-3 px-3 rounded-lg h-10 w-full md:w-80 bg-white dark:bg-dark relative focus-within:ring-1 focus-within:ring-primary min-w-40 shrink">
      <Search size={20} className="text-muted-foreground shrink-0" />
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder") || "Search Schools..."}
        className="w-full border-none outline-none focus:outline-none bg-transparent"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SeachBar;
