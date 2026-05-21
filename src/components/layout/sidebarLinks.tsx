
import { School } from "lucide-react";

export const sideBarRoutes = [
  {
    title: "schoolsManagement",
    url: "#",
    icon: School,
    isActive: true,
    open: true,
    items: [
      {
        icon: School,
        title: "schools",
        url: "",
      },
    ],
  },
];
