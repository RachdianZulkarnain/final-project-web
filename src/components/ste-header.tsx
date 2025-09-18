"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useGetTenant from "@/hooks/api/account/useGetTenant";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return { label, href };
  });

  // Ambil data tenant
  const { data: tenant } = useGetTenant();
  const { data: session } = useSession();

  const tenantName = tenant?.name || "User";
  const tenantEmail = session?.user?.email || "user@example.com";
  const tenantImage = tenant?.imageUrl || "/assets/avatar.png";

  return (
    <header
      className="sticky top-0 z-50 flex h-[var(--header-height)] shrink-0 items-center 
      border-b border-border bg-card/50 backdrop-blur-sm 
      px-4 shadow-sm transition-[width,height] ease-linear 
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)] lg:px-6"
    >
      <div className="flex w-full items-center justify-between gap-2">
        {/* Left side: sidebar trigger and breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="-ml-1 text-[#0290d1]" />
          <Separator
            orientation="vertical"
            className="h-6 bg-muted-foreground/40 hidden sm:block"
          />

          {/* Breadcrumbs - sembunyikan di layar kecil */}
          <nav className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#0290d1] truncate">
            {breadcrumbs.map((crumb) => (
              <span
                key={crumb.href}
                className="flex items-center gap-2 shrink-0"
              >
                <span className="text-muted-foreground">›</span>
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-primary hover:underline truncate max-w-[120px] sm:max-w-[200px]"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        {/* Right side: avatar profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard/account" className="text-[#0290d1]">
            <Avatar className="w-8 h-8 border border-[#0290d1]">
              <AvatarImage src={tenantImage} alt={tenantName} />
              <AvatarFallback className="bg-primary text-white text-sm">
                {tenantName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-slate-700 truncate max-w-[100px] sm:max-w-[150px]">
              {tenantName}
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[150px]">
              {tenantEmail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
