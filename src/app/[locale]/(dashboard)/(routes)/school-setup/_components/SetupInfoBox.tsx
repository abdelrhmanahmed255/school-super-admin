"use client";

import { Info } from "lucide-react";

export function SetupInfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-blue-900 dark:text-blue-100">{children}</p>
    </div>
  );
}
