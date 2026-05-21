"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";



export default function WebsiteProtectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/"); // التوجيه بعد render وليس أثناءه
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) return null;

  return children;
}
