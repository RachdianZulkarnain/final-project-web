"use client";

import {
  IconDashboard,
  IconListDetails,
  IconReceipt2,
  IconSettings,
  IconClipboardList,
  IconPencil,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useGetDashboardProfile } from "@/app/dashboard/settings/_hooks/useGetDashboardProfile"; 

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
      title: "My Listings",
      url: "/dashboard/listings",
      icon: IconListDetails,
      children: [
        {
          title: "New Listing",
          url: "/dashboard/listings/create",
        },
      ],
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
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">H</span>
        </div>
        <span className="font-bold text-foreground text-lg">Homigo</span>
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
