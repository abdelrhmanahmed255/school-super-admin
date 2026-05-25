import {
  School, Settings, LayoutDashboard, CreditCard,
  BarChart3, SlidersHorizontal,
} from "lucide-react";

export const sideBarRoutes = [
  {
    title: "dashboard",
    url: "",
    icon: LayoutDashboard,
    isActive: true,
    open: true,
    items: [],
  },
  {
    title: "schoolsManagement",
    url: "#",
    icon: School,
    isActive: true,
    open: true,
    items: [
      { icon: School, title: "schools", url: "schools" },
      { icon: Settings, title: "setupWizard", url: "school-setup" },
    ],
  },
  {
    title: "subscriptionManagement",
    url: "#",
    icon: CreditCard,
    isActive: true,
    open: false,
    items: [
      { icon: CreditCard, title: "subscriptions", url: "subscriptions" },
    ],
  },
  {
    title: "systemAdministration",
    url: "#",
    icon: SlidersHorizontal,
    isActive: true,
    open: false,
    items: [
      { icon: BarChart3, title: "analytics", url: "analytics" },
      { icon: SlidersHorizontal, title: "systemSettings", url: "settings" },
    ],
  },
];
