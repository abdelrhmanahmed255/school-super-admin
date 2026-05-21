"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { sideBarRoutes } from "./sidebarLinks";
import { usePathname } from "next/navigation";

function RoutesHistory() {
  const locale = useLocale();
  const path = usePathname();
  const t = useTranslations("sidebar");

  const rawSegments = path.split("/").filter(Boolean);
  const segments =
    rawSegments[0] === locale ? rawSegments.slice(1) : rawSegments;

  const buildHref = (index: number) =>
    `/${locale}/${segments.slice(0, index + 1).join("/")}`;

  // Find the top-level group that contains any of the segments
  const parentRoute = sideBarRoutes.find((group) => {
    return group.items?.some((item) => {
      // Check if item itself matches segments[0]
      if (item.url === "" && segments.length === 0) return true;
      if (
        item.url === segments[0] ||
        (item.url === "#" && item.title === segments[0])
      )
        return true;
      // Check if any sub-item matches the specific path
      if ("items" in item && Array.isArray(item.items)) {
        return (
          item.items.some(
            (subItem: any) => subItem.url === segments.join("/"),
          ) ||
          item.items.some(
            (subItem: any) =>
              subItem.url.split("/").pop() === segments[segments.length - 1],
          )
        );
      }
      return false;
    });
  });

  // Helper to find title from sideBarRoutes based on a segment or full path segment string
  const getSegmentTitle = (seg: string, index: number) => {
    // Collect all possible items from all levels
    let foundTitle = seg;

    // First level search (within the parent group items)
    if (parentRoute) {
      const targetPath = segments.slice(0, index + 1).join("/");

      const item = parentRoute.items.find(
        (i) =>
          i.url === targetPath ||
          i.url === seg ||
          (i.url === "#" && i.title === seg),
      );
      if (item) {
        foundTitle = item.title;
      } else {
        // Second level search
        parentRoute.items.forEach((i: any) => {
          if (i.items && Array.isArray(i.items)) {
            const subItem = i.items.find(
              (si: any) =>
                si.url === targetPath || si.url.split("/").pop() === seg,
            );
            if (subItem) foundTitle = subItem.title;
          }
        });
      }
    }

    return t.has(foundTitle) ? t(foundTitle) : seg;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parentRoute && (
          <>
            <BreadcrumbItem className="hidden md:block">
              {t(parentRoute.title)}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block">
              {locale !== "en" ? <ChevronLeft /> : <ChevronRight />}
            </BreadcrumbSeparator>
          </>
        )}

        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          const label = getSegmentTitle(seg, idx);

          return (
            <React.Fragment key={seg + idx}>
              <BreadcrumbItem className="hidden md:block">
                {isLast ? (
                  <span className="font-semibold text-foreground">{label}</span>
                ) : (
                  <BreadcrumbLink href={buildHref(idx)}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator className="hidden md:block">
                  {locale !== "en" ? <ChevronLeft /> : <ChevronRight />}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default RoutesHistory;
