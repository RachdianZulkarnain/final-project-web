"use client";

import {
  IconBed,
  IconBuilding,
  IconCalendarCheck,
  IconCalendarWeek,
  IconCategory,
  IconUser,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import useGetTenant from "@/hooks/api/account/useGetTenant";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { url } from "inspector";

const data = {
  navMain: [
    { title: "My Profile", url: "/dashboard/account", icon: IconUser },
    {
      title: "My Properties",
      icon: IconBuilding,
      url: "/dashboard/property",
    },
    {
      title: "Room Non Availability",
      url: "/dashboard/property/room-non-availability",
      icon: IconCalendarCheck,
    },
    {
      title: "Peak Season Rate",
      url: "/dashboard/property/peak-season-rate",
      icon: IconCalendarWeek,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: tenant } = useGetTenant();
  const { data: session } = useSession();

  const tenantName = tenant?.name || "Tenant";
  const tenantEmail = session?.user?.email || "tenant@example.com";
  const tenantImage = tenant?.imageUrl || "/assets/avatar.png";

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-card/50 backdrop-blur-sm border-r border-border shadow-md"
      {...props}
    >
      <Link
        href="/dashboard"
        className="px-4 py-3 border-b border-border flex items-center gap-2 ml-2"
      >
        <Avatar className="w-12 h-12 border border-[#0290d1]">
          <AvatarImage src={tenantImage} alt={tenantName} />
          <AvatarFallback className="bg-primary text-white text-sm">
            {tenantName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-lg text-[#0290d1] truncate max-w-[120px]">
            {tenantName}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            {tenantEmail}
          </span>
        </div>
      </Link>

      <SidebarContent className="px-3 py-10">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-3 py-4 bg-card/30">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
