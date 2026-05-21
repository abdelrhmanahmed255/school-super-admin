"use client";

import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { RootState } from "@/store";

export default function ProtectDashboard({
  children,
  locale,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  if (!isLoggedIn) {
    return redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
