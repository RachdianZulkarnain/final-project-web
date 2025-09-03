"use client";

import {
  IconDashboard,
  IconListDetails,
  IconReceipt2,
  IconSettings,
  IconClipboardList,
  IconPencil,
  IconCalendar,
  IconCalendarBolt,
  IconCalendarCheck,
  IconHome,
  IconBuilding,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useGetDashboardProfile } from "@/app/dashboard/settings/_hooks/useGetDashboardProfile";
import Image from "next/image";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconReceipt2,
    },
    {
      title: "My Properties",
      url: "/dashboard/property",
      icon: IconBuilding,
      children: [
        {
          title: "Manage category",
          url: "/dashboard/property/category",
        },
        {
          title: "Manage Property",
          url: "/dashboard/property/management",
        },
        {
          title: "Manage Room",
          url: "/dashboard/property/room",
        },

        {
          title: "Room Non Availability",
          url: "/dashboard/property/room-non-availability",
        },
      ],
    },
    {
      title: "Peak Seasons",
      url: "/dashboard/property/peak-season-rate",
      icon: IconCalendar,
    },
    {
      title: "Sales Report",
      url: "/dashboard/report",
      icon: IconClipboardList,
    },
    {
      title: "Guest Reviews",
      url: "/dashboard/reviews",
      icon: IconPencil,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
      children: [
        {
          title: "Bank Details",
          url: "/dashboard/settings/bank-details",
        },
        {
          title: "Change Password",
          url: "/dashboard/settings/change-password",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useGetDashboardProfile();

  const user = {
    name: profile?.firstName ?? "Loading...",
    email: profile?.email ?? "",
    avatar: profile?.imageUrl ?? "/avatars/default.jpg",
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-card/50 backdrop-blur-sm border-r border-border shadow-md"
      {...props}
    >
      {/* Logo / Branding */}
      <div className="px-4 py-3 border-b border-border flex items-center space-x-2">
        <Image
          src="/assets/Homigo Logo1.png"
          alt="Homigo Logo"
          width={40}
          height={40}
          className="object-contain flex items-center justify-center"
        />
        <span className="font-bold text-lg text-[#0290d1]">Homigo</span>
      </div>

      {/* Navigation */}
      <SidebarContent className="px-3 py-4">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-border px-3 py-4 bg-card/30">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
