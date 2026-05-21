import Image from "next/image";
import React from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import ChangeTheme from "../Theme";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import RoutesHistory from "./routes-history";

function AppHeader() {
  return (
    <div className="sticky top-0 z-50  flex items-center justify-between   w-full bg-sidebar pe-3 h-16">
      <div className="relative w-40 h-14 mx-4">
        <Image
          alt="logo"
          src="/logo.png"
          fill
          className="absolute object-fill dark:invert"
        />
      </div>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="ms-2 data-[orientation=vertical]:h-4"
        />
        <RoutesHistory />
      </div>
      <div className="flex items-center gap-4">
        <ChangeTheme />
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default AppHeader;
