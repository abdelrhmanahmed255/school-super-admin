"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { sideBarRoutes } from "./sidebarLinks";
import { usePathname } from "next/navigation";

function localePath(locale: string, url: string) {
  return url ? `/${locale}/${url}` : `/${locale}`;
}

function isLocaleRouteActive(pathname: string, locale: string, url: string) {
  const href = localePath(locale, url);
  return pathname === href || pathname === `${href}/`;
}

export function NavMain() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const locale = useLocale();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {sideBarRoutes.map((item) => {
          const isGroupActive = item.items?.some((subItem) =>
            isLocaleRouteActive(pathname, locale, subItem.url),
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isGroupActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={t(item.title)}
                    className="cursor-pointer h-10  text-base"
                  >
                    {item.icon && <item.icon />}
                    <span>{t(item.title)}</span>

                    {locale === "en" ? (
                      <ChevronRight className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    ) : (
                      <ChevronLeft className="ms-auto transition-transform group-data-[state=open]/collapsible:-rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenu>
                    {item.items?.map((subItem) => {
                      const isActive = isLocaleRouteActive(
                        pathname,
                        locale,
                        subItem.url,
                      );

                      const hasChildren =
                        "items" in subItem &&
                        Array.isArray((subItem as any).items) &&
                        (subItem as any).items.length > 0;
                      const isSubGroupActive =
                        hasChildren &&
                        (subItem as any).items?.some(
                          (child: any) =>
                            isLocaleRouteActive(pathname, locale, child.url),
                        );

                      if (hasChildren) {
                        return (
                          <Collapsible
                            key={subItem.title}
                            asChild
                            defaultOpen={isActive || isSubGroupActive}
                            className="group/subcollapsible"
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  tooltip={t(subItem.title)}
                                  className={`cursor-pointer h-10 text-base hover:bg-primary/10 transition-all duration-300 ease-in-out hover:scale-105 hover:text-primary
                                    ${isActive || isSubGroupActive ? "  bg-linear-to-l to-primary   from-primary/80  text-white hover:text-white " : ""}`}
                                >
                                  {subItem.icon && <subItem.icon />}
                                  <span>{t(subItem.title)}</span>
                                  {locale === "en" ? (
                                    <ChevronRight className="ms-auto transition-transform group-data-[state=open]/subcollapsible:rotate-90" />
                                  ) : (
                                    <ChevronLeft className="ms-auto transition-transform group-data-[state=open]/subcollapsible:-rotate-90" />
                                  )}
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {(subItem as any).items?.map((child: any) => {
                                    const isChildActive =
                                      isLocaleRouteActive(
                                        pathname,
                                        locale,
                                        child.url,
                                      );

                                    return (
                                      <SidebarMenuSubItem key={child.title}>
                                        <SidebarMenuSubButton
                                          asChild={!isChildActive}
                                          className={`hover:bg-primary/10 h-9 transition-all text-sm duration-300 ease-in-out hover:text-primary
                                            ${isChildActive ? "  bg-linear-to-l to-primary   from-primary/80  text-white hover:text-white " : ""}`}
                                        >
                                          {isChildActive ? (
                                            <>
                                              {child.icon && <child.icon />}
                                              <span>{t(child.title)}</span>
                                            </>
                                          ) : (
                                            <Link
                                              href={localePath(locale, child.url)}
                                            >
                                              {child.icon && <child.icon />}
                                              <span>{t(child.title)}</span>
                                            </Link>
                                          )}
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        );
                      }

                      return (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild={!isActive}
                            tooltip={t(subItem.title)}
                            className={`hover:bg-primary/10 h-10 transition-all  text-base  duration-300 ease-in-out hover:scale-105 hover:text-primary
                              ${isActive ? "  bg-linear-to-l to-primary   from-primary/80  text-white hover:text-white " : ""}`}
                          >
                            {isActive ? (
                              <>
                                {subItem.icon && <subItem.icon />}
                                <span>{t(subItem.title)}</span>
                              </>
                            ) : (
                              <Link href={localePath(locale, subItem.url)}>
                                {subItem.icon && <subItem.icon />}
                                <span>{t(subItem.title)}</span>
                              </Link>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
