"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header
      className="
        sticky top-0 z-50 
        flex h-[var(--header-height)] shrink-0 items-center
        border-b border-border 
        bg-card/50 backdrop-blur-sm
        px-4 lg:px-6
        shadow-sm 
        transition-[width,height] ease-linear 
        group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]
      "
    >
      <SidebarTrigger className="-ml-1 text-[#0290d1]" />
    </header>
  );
}
