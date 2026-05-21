"use client";
import { NavMain } from "@/components/layout/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import { LayoutGrid } from "lucide-react";

import Link from "next/link";
import { NavUser } from "../nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("sidebar");
  const locale = useLocale();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader dir={locale !== "en" ? "rtl" : "ltr"}>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavUser
          user={{
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
        {/* <SidebarMenuButton tooltip={t("dashboard")} asChild>
          <Link href={`/${locale}/dashboard`}>
            <LayoutGrid />
            <span>{t("dashboard")}</span>
          </Link>
        </SidebarMenuButton> */}
      </SidebarHeader>
      <SidebarContent dir={locale !== "en" ? "rtl" : "ltr"}>
        <NavMain />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
