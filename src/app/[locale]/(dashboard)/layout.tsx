import React from "react";
import ProtectDashboard from "@/components/protect_dashboard";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocale } from "next-intl";
import RoutesHistory from "@/components/layout/routes-history";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();

  return (
    <ProtectDashboard locale={locale}>
      <div dir={locale !== "en" ? "rtl" : "ltr"} className=" flex flex-col">
        <SidebarProvider>
          <AppSidebar side={locale !== "en" ? "right" : "left"} />
          <SidebarInset>
            <header className="flex h-16 bg-sidebar shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center justify-between gap-3 px-4 w-full">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <Separator
                    orientation="vertical"
                    className="  data-[orientation=vertical]:h-4"
                  />
                  <RoutesHistory />
                </div>
                <LanguageSwitcher />
              </div>
            </header>
            <div className="flex-1 py-4 px-3 sm:px-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ProtectDashboard>
  );
}
